import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon } from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import { publicService } from '@/services/publicService';

const TeamSection = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await publicService.getTeam();
      setTeam(data || []);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (team.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Our Team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Meet the dedicated people behind our fellowship
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center p-6">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <UserIcon className="h-16 w-16 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {member.role}
                </p>
                {member.bio && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {member.bio}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;