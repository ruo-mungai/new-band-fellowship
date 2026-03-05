const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

class GalleryService {
  // Get all gallery images
  async getAllImages(filters = {}) {
    const { active, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where = {};
    if (active !== undefined) {
      where.isActive = active === 'true' || active === true;
    }

    const [images, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.gallery.count({ where })
    ]);

    return {
      images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get single image
  async getImageById(id) {
    const image = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    return image;
  }

  // Add image to gallery
  async addImage(data, file) {
    const { title, description, order } = data;

    // Handle file upload
    let imageUrl = data.imageUrl;
    if (file) {
      // In production, upload to cloud storage
      imageUrl = `/uploads/gallery/${file.filename}`;
    }

    if (!imageUrl) {
      throw new AppError('Image URL or file is required', 400);
    }

    // Get max order if not provided
    let imageOrder = order;
    if (!imageOrder) {
      const lastImage = await prisma.gallery.findFirst({
        orderBy: { order: 'desc' }
      });
      imageOrder = lastImage ? lastImage.order + 1 : 1;
    }

    const image = await prisma.gallery.create({
      data: {
        title,
        description,
        imageUrl,
        order: imageOrder,
        isActive: true
      }
    });

    return image;
  }

  // Update image
  async updateImage(id, data, file) {
    const image = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    const updateData = { ...data };
    
    // Handle file upload
    if (file) {
      updateData.imageUrl = `/uploads/gallery/${file.filename}`;
      // In production, delete old image from storage
    }

    const updated = await prisma.gallery.update({
      where: { id },
      data: updateData
    });

    return updated;
  }

  // Delete image
  async deleteImage(id) {
    const image = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    // Delete image file from storage (in production)
    // if (image.imageUrl) {
    //   const filename = path.basename(image.imageUrl);
    //   await fs.unlink(path.join(uploadDir, filename));
    // }

    await prisma.gallery.delete({
      where: { id }
    });

    // Reorder remaining images
    await this.reorderAfterDelete(image.order);

    return { message: 'Image deleted successfully' };
  }

  // Reorder images
  async reorderImages(orders) {
    const updates = orders.map(({ id, order }) =>
      prisma.gallery.update({
        where: { id },
        data: { order }
      })
    );

    await prisma.$transaction(updates);

    return { message: 'Gallery reordered successfully' };
  }

  // Helper: Reorder after delete
  async reorderAfterDelete(deletedOrder) {
    const imagesToUpdate = await prisma.gallery.findMany({
      where: { order: { gt: deletedOrder } }
    });

    const updates = imagesToUpdate.map(img =>
      prisma.gallery.update({
        where: { id: img.id },
        data: { order: img.order - 1 }
      })
    );

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }
  }

  // Toggle active status
  async toggleActive(id) {
    const image = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    const updated = await prisma.gallery.update({
      where: { id },
      data: { isActive: !image.isActive }
    });

    return updated;
  }

  // Bulk upload
  async bulkUpload(files, data) {
    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    // Get starting order
    const lastImage = await prisma.gallery.findFirst({
      orderBy: { order: 'desc' }
    });
    let startOrder = lastImage ? lastImage.order + 1 : 1;

    const images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const image = await prisma.gallery.create({
        data: {
          title: data.title || file.originalname,
          description: data.description || '',
          imageUrl: `/uploads/gallery/${file.filename}`,
          order: startOrder + i,
          isActive: true
        }
      });
      images.push(image);
    }

    return images;
  }

  // Get gallery stats
  async getStats() {
    const [total, active] = await Promise.all([
      prisma.gallery.count(),
      prisma.gallery.count({ where: { isActive: true } })
    ]);

    return {
      total,
      active,
      inactive: total - active
    };
  }
}

module.exports = new GalleryService();