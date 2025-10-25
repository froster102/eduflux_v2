import { createFileRoute } from '@tanstack/react-router';
import { Card } from '@heroui/card';
import { Button } from '@heroui/button';
import { Badge } from '@heroui/badge';
import { Skeleton } from '@heroui/skeleton';

import StatsCard from '@/components/StatsCard';
import TaskManager from '@/features/task/components/TaskManager';
import { useAuthStore } from '@/store/auth-store';
import UpcomingSessionSection from '@/features/session/components/UpcomingSessionSection';
import { useGetInstructorStats } from '@/features/instructor/hooks/useGetInstructorStats';

export const Route = createFileRoute('/instructor/_layout/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { data: instructorStats, isPending: isInstructorStatsPending } =
    useGetInstructorStats();

  const courses = [
    {
      id: 1,
      title: 'Start in Web',
      views: '14,235',
      rating: 4.9,
      price: '$25',
      lessons: '24 lessons',
      hours: '2 hours',
      level: 'Basic',
      image: 'https://via.placeholder.com/200x150?text=Start+in+Web', // Mock image
      instructor: 'Esther Howard',
    },
    {
      id: 2,
      title: 'Figma',
      views: '14,235',
      rating: 4.8,
      price: '$25',
      lessons: '24 lessons',
      hours: '2 hours',
      level: 'Basic',
      image: 'https://via.placeholder.com/200x150?text=Figma',
      instructor: 'Esther Howard',
    },
    {
      id: 3,
      title: 'Motion',
      views: '14,235',
      rating: 4.7,
      price: '$25',
      lessons: '24 lessons',
      hours: '2 hours',
      level: 'Motion',
      image: 'https://via.placeholder.com/200x150?text=Motion',
      instructor: 'Esther Howard',
    },
    {
      id: 4,
      title: 'UX',
      views: '14,235',
      rating: 4.6,
      price: '$25',
      lessons: '24 lessons',
      hours: '2 hours',
      level: 'Basic',
      image: 'https://via.placeholder.com/200x150?text=UX',
      instructor: 'Esther Howard',
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-sm pt-2 text-default-500">
          Welcome to Eduflux, check your priority learning.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isInstructorStatsPending ? (
          <>
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
          </>
        ) : (
          instructorStats?.data && (
            <>
              <StatsCard
                title="Learners"
                value={instructorStats.data.totalLearners + ''}
              />
              <StatsCard
                title="Courses"
                value={instructorStats.data.totalCourses + ''}
              />
              <StatsCard title="Total Earnings" value="$14" />
              <StatsCard
                title="Sessions Conducted"
                value={instructorStats.data.sessionsConducted + ''}
              />
            </>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskManager />

        <UpcomingSessionSection />
      </div>

      {/* Courses Section */}
      <Card className="p-4 border border-default-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your courses</h3>
          <Button size="sm" variant="ghost">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-default-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                alt={course.title}
                className="w-full h-32 object-cover"
                src={course.image}
              />
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge color="default" size="sm" variant="flat">
                    {course.level}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {/* <Icon
                      className="text-warning-500"
                      icon="solar:star-outline"
                    /> */}
                    <span className="text-sm">{course.rating}</span>
                  </div>
                </div>
                <h4 className="font-medium mb-1">{course.title}</h4>
                <p className="text-xs text-default-500 mb-2">
                  {course.lessons} | {course.hours}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{course.price}</span>
                  <span className="text-xs text-default-500">
                    {course.views} views
                  </span>
                </div>
                <Button className="w-full mt-2" size="sm" variant="ghost">
                  View details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
