'use client';
// import { getNotificationsCount } from '@/services/getNotifications';
import Image from 'next/image';
import Link from 'next/link';
// import React, { useEffect, useState } from 'react';

type NotificationIconProps = object;

const NotificationIcon: React.FC<NotificationIconProps> = () => {
  // const [notificationCount, setNotificationCount] = useState(0);

  // useEffect(() => {
  //   getNotificationsCount()
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setNotificationCount(res.count);
  //     });
  // }, []);

  return (
    <Link href={'/notifications'}>
      <div className="relative">
        <Image
          src="https://res.cloudinary.com/dsuiwxwkg/image/upload/v1740317343/Notification_01_iaggbk.png"
          height={70}
          width={70}
          className="w-auto lg:w-[3vw] h-12"
          alt=""
        ></Image>

        {/* <div
          className={`${notificationCount > 0 ? 'absolute' : 'hidden'}  bottom-[-13px] text-white right-[15px] bg-indigo-900 pl-[10px] pt-[1px] pb-[1px] pr-[10px] rounded-full mt-8 font-poppins`}
        >
          {' '}
          {notificationCount}
        </div> */}
      </div>
    </Link>
  );
};
export default NotificationIcon;
