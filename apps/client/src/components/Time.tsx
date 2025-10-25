import { Card, CardBody } from '@heroui/card';
import React from 'react';
import { motion } from 'motion/react';

interface TimeCardProps {
  className?: string;
  classNames?: {
    text: string;
  };
}

export default function Time({ className, classNames }: TimeCardProps) {
  const [timeString, setTimeString] = React.useState<string>();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      animate={{
        opacity: 1,
      }}
      className={className}
      exit={{
        opacity: 0,
      }}
      initial={{
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <Card className="bg-transparent" shadow="none">
        <CardBody className="overflow-hidden p-0">
          <p className={`${classNames?.text}`}>{timeString}</p>
        </CardBody>
      </Card>
    </motion.div>
  );
}
