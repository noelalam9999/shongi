'use client';
// import { ICart } from '@/interfaces/ICart';
import { Box, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import React from 'react';

import { useAppSelector } from '@/lib/hooks';

import { IAppointment } from '@/interfaces/IAppointment';
import { useSearchParams } from 'next/navigation';

type AppointmentDetailsProps = {
  children?: string;
};

const AppointmentDetails: React.FC<AppointmentDetailsProps> = () => {
  const appointment: IAppointment = useAppSelector(
    (state) => state.appointment,
  );

  const searchParams = useSearchParams();

  const payment_amount = searchParams.get('payment_amount');
  const payment_amount_in_percent =
    parseInt(
      ((payment_amount as string).match(/\d+/g) as string[]).length > 0
        ? ((payment_amount as string).match(/\d+/g) as string[])[0]
        : '100',
    ) / 100;

  const price = appointment.price as number;
  const platformFee = 30;
  const vat = price * 0.15;
  const payNow =
    payment_amount_in_percent === 0
      ? 0
      : price * payment_amount_in_percent + platformFee + vat;
  const payAfter =
    payment_amount_in_percent === 0
      ? price * (1 - payment_amount_in_percent) + platformFee + vat
      : price * (1 - payment_amount_in_percent);

  return (
    <div className="w-full mt-4 ">
      <Box className="">
        <Flex
          align={'center'}
          width={'full'}
          justify={'between'}
          className="border-2 p-2 rounded-md mb-2 shadow-md"
        >
          <Flex>
            <Image
              src={
                'https://res.cloudinary.com/dsuiwxwkg/image/upload/v1740306044/appointment_qrpcom.png'
              }
              width={100}
              height={100}
              alt="cart-item"
            ></Image>
            <div className="ml-2">
              <p className="font-poppins font-bold text-lg">
                {appointment.service_name}
              </p>
              <p className="font-poppins">
                <span className="font-bold text-gray-500">Date</span>{' '}
                {new Date(
                  appointment.selectedDate as Date,
                ).toLocaleDateString()}{' '}
              </p>
              <p className="font-poppins">
                <span className="font-bold text-gray-500"> Timeframe </span>{' '}
                {appointment.startTime} - {appointment.endTime}
              </p>
            </div>
          </Flex>
          {/* <Counter quantity={item.quantity}></Counter> */}
        </Flex>
      </Box>
      <Box className="mt-5 mb-5">
        <Flex justify={'between'} className="mb-2">
          {' '}
          <p className="font-poppins font-bold text-gray-400">Summary</p>
          <p className="font-poppins font-bold ">
            {appointment.price}
            Tk
          </p>
        </Flex>

        <Flex
          justify={'between'}
          className="border-b-2 border-black border-dotted pb-5"
        >
          {' '}
          <p className="font-poppins font-bold text-gray-400">Platform fee</p>
          <p className="font-poppins font-bold">{30}Tk</p>
        </Flex>
        <Flex
          justify={'between'}
          className="border-b-2 border-black border-dotted pb-5"
        >
          {' '}
          <p className="font-poppins font-bold text-gray-400">Vat (15%)</p>
          <p className="font-poppins font-bold">
            {(appointment.price as number) * 0.15}
            Tk
          </p>
        </Flex>
        <Flex justify={'between'} className="mt-5">
          <p className="font-poppins font-bold text-gray-400">Pay Now</p>
          <p className="font-poppins font-bold">
            {payNow.toFixed(2)} Tk
          </p>
        </Flex>
        <Flex justify={'between'} className="mt-5">
          <p className="font-poppins font-bold text-gray-400">
            Pay After Service
          </p>
          <p className="font-poppins font-bold">
            {payAfter.toFixed(2)} Tk
          </p>
        </Flex>
      </Box>
    </div>
  );
};
export default AppointmentDetails;
