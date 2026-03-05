import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { UserIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const commentSchema = z.object({
  content: z.string().min(3, 'Comment must be at least 3 characters').max(500, 'Comment too long'),
});

const CommentSection = ({ postId, comments: initialComments = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    setLoading(true);
    try {
      // API call to post comment
      const response = await fetch(`/api/blogs/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          content: data.content,
          parentId: replyingTo,
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const newComment = await response.json();
      
      if (replyingTo) {
        // Add reply to nested structure
        setComments(prev => 
          prev.map(comment => 
            comment.id === replyingTo
              ? { ...comment, replies: [...(comment.replies || []), newComment] }
              : comment
          )
        );
        setReplyingTo(null);
      } else {
        setComments(prev => [newComment, ...prev]);
      }
      
      reset();
      toast.success('Comment posted successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const Comment = ({ comment, depth = 0 }) => {
    const [showReply, setShowReply] = useState(false);

    return (
      <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'}`}>
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.user?.profileImage ? (
              <img
                src={comment.user.profileImage}
                alt={comment.user.firstName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.user?.firstName} {comment.user?.lastName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 mt-2 ml-2">
              <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center space-x-1">
                <HeartIcon className="h-4 w-4" />
                <span>{comment.likes || 0}</span>
              </button>
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center space-x-1"
              >
                <ChatBubbleLeftIcon className="h-4 w-4" />
                <span>Reply</span>
              </button>
            </div>

            {/* Reply Form */}
            {showReply && (
              <div className="mt-4 ml-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-3">
                  <TextArea
                    {...register('content')}
                    placeholder="Write a reply..."
                    rows={2}
                    error={errors.content?.message}
                    className="flex-1"
                  />
                  <div className="flex flex-col space-y-2">
                    <Button type="submit" size="sm" loading={loading}>
                      Post
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReply(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Replies */}
            {comment.replies?.map((reply) => (
              <Comment key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <TextArea
          {...register('content')}
          placeholder={isAuthenticated ? "Share your thoughts..." : "Please login to comment"}
          rows={4}
          error={errors.content?.message}
          disabled={!isAuthenticated}
        />
        {isAuthenticated && (
          <div className="mt-4 flex justify-end">
            <Button type="submit" loading={loading}>
              Post Comment
            </Button>
          </div>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;