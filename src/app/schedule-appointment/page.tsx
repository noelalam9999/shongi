'use client';

import { useState } from 'react';
import {
  format,
  isBefore,
  startOfDay,
  addMinutes,
  setHours,
  isAfter,
} from 'date-fns';
import { DayPicker } from 'react-day-picker';
import * as Select from '@radix-ui/react-select';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import 'react-day-picker/dist/style.css';
import { useRouter, useSearchParams } from 'next/navigation';
import FloatingCallButton from '@/components/FloatingCallButton';
import '@/styles/schedule.page.css';
import Button from '@/components/Button';
// import { CiCircleInfo } from 'react-icons/ci';
import Topbar from '@/components/Topbar';
import { IoIosArrowBack } from 'react-icons/io';
import { useAppDispatch } from '@/lib/hooks';
import { Input } from '@/components/ui/input';
import SelectComponent from '@/components/ui/select';
import { setAppointment } from '@/lib/features/appointment/appointmentDetails';

const options = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

const transportOptions = [
  {
    label: 'UBER',
    value: 'UBER',
  },
  {
    label: 'I have a car',
    value: 'Own_car',
  },
  {
    label: 'CNG',
    value: 'CNG',
  },
  {
    label: 'Public Transport',
    value: 'Public_transport',
  },
  {
    label: 'Upto the Agent',
    value: 'Agent_preference',
  },
];

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const duration = searchParams.get('duration');
  // const price = searchParams.get('price');

  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [servicePointAddress, setServicePointAddress] = useState<string>('');
  const [selectedStartTime, setSelectedStartTime] = useState<
    string | undefined
  >(undefined);
  const [gender, setGender] = useState('');
  const [transport, setTransport] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const handleDateChange = (date: Date | undefined) => {
    if (date && isBefore(date, startOfDay(new Date()))) {
      alert('Please select a future date!');
      return;
    }
    setSelectedDate(date);
    setSelectedStartTime(undefined);
  };

  const generateStartTimeOptions = () => {
    const timeOptions: string[] = [];
    const now = new Date();
    let startTime = selectedDate
      ? startOfDay(selectedDate)
      : startOfDay(new Date());

    if (selectedDate && isSameDay(selectedDate, now)) {
      const minutes = now.getMinutes();
      const nextHalfHour =
        minutes % 30 === 0 ? minutes : Math.ceil(minutes / 30) * 30;

      startTime = setHours(startTime, now.getHours());
      startTime.setMinutes(nextHalfHour);
    } else {
      startTime = setHours(startTime, 0); // Start from midnight
    }

    const earliestStart = setHours(startOfDay(selectedDate || now), 0); // Midnight
    let latestStart = setHours(
      startOfDay(selectedDate || now),
      23
    );
    latestStart = new Date(latestStart.setMinutes(30)); // 23:30 is the last slot

    for (let i = 0; i < 48; i++) {
      const time = addMinutes(startTime, i * 30);
      if (
        !isAfter(time, latestStart) &&
        !isBefore(time, earliestStart) &&
        (!isBefore(time, now) || !isSameDay(selectedDate || now, now)) // Only allow times after current time for today
      ) {
        timeOptions.push(format(time, 'HH:mm'));
      }
    }

    return timeOptions;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getStartDate = () => {
    return new Date().getHours() < 18
      ? new Date()
      : new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  };

  const getDefaultMonth = () => {
    return new Date(getStartDate().getFullYear(), getStartDate().getMonth());
  };

  const getEndTime = (startTime: string) => {
    if (!startTime) return undefined;
    const [startHour, startMinutes] = startTime.split(':').map(Number);

    const startDateTime = setHours(
      addMinutes(startOfDay(selectedDate!), startHour * 60 + startMinutes),
      startHour,
    );
    const endTime = addMinutes(
      startDateTime,
      parseInt(duration as string) * 60,
    );

    return format(endTime, 'HH:mm');
  };

  const handleStartTimeChange = (value: string) => {
    setSelectedStartTime(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedDate ||
      !selectedStartTime ||
      !homeAddress ||
      !servicePointAddress ||
      !contactInfo ||
      !transport
    ) {
      alert('Please fill up all the mandatory fields!');
      return;
    }

    if (contactInfo.length !== 11) {
      alert('Please Provide a valid 11 digit phone number!');
      return;
    }

    const endTime = getEndTime(selectedStartTime);

    dispatch(
      setAppointment({
        selectedDate: selectedDate,
        startTime: selectedStartTime as string,
        homeAddress: homeAddress,
        servicePointAddress: servicePointAddress,
        contactInfo: contactInfo,
        transport: transport,
        agentGenderPreference: gender,
        additionalDetails: additionalDetails,
        endTime: endTime,
      }),
    );
    router.push('/payment-method');
  };

  return (
    <>
      <Topbar
        title="Appointment"
        leftIcon={<IoIosArrowBack fontSize={'24px'} />}
      />
      <div className=" lg:min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-sm w-full p-6 bg-white rounded-xl shadow-lg flex flex-col justify-evenly">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Select a Date for your appointment
              </label>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                disabled={{ before: getStartDate() }}
                className="border rounded-lg p-2 bg-gray-50 w-full"
                defaultMonth={getDefaultMonth()}
              />
            </div>

            {selectedDate && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select a 4-hour Time Frame
                  </label>
                  <Select.Root
                    value={selectedStartTime}
                    onValueChange={handleStartTimeChange}
                  >
                    <Select.Trigger
                      className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-lg h-14 text-xl bg-white"
                      aria-label="Start Time"
                    >
                      <Select.Value placeholder="Select a start time" />
                      <Select.Icon>
                        <FiChevronDown />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Content className="bg-white shadow-lg rounded-lg">
                      <Select.ScrollUpButton className="flex items-center justify-center p-2">
                        <FiChevronUp />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="p-2">
                        <Select.Group>
                          {generateStartTimeOptions().map((time, index) => (
                            <Select.Item
                              key={index}
                              value={time}
                              className="cursor-pointer select-none p-2 rounded-md hover:bg-blue-100"
                            >
                              <Select.ItemText>{time}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Viewport>
                      <Select.ScrollDownButton className="flex items-center justify-center p-2">
                        <FiChevronDown />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Root>
                </div>
              </>
            )}

            {selectedStartTime && (
              <>
                <div className="text-lg font-medium text-gray-800 mt-1">
                  End Time: {getEndTime(selectedStartTime)}
                </div>

                <Input
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setHomeAddress(e.currentTarget.value)
                  }
                  className="h-14 text-xl"
                  type="name"
                  placeholder="Home Address"
                />
                <Input
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setServicePointAddress(e.currentTarget.value)
                  }
                  className="h-14 text-xl"
                  type="textarea"
                  placeholder="Hospital Address"
                />

                <SelectComponent
                  handleChange={(e) => setGender(e)}
                  options={options}
                  placeholder="Select Agent Gender"
                />

                <SelectComponent
                  handleChange={(e) => setTransport(e)}
                  options={transportOptions}
                  placeholder="Select Transport Mode"
                />

                <Input
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setContactInfo(e.currentTarget.value)
                  }
                  className="h-14 text-xl "
                  type="name"
                  placeholder="Contact Info"
                />
                <Input
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setAdditionalDetails(e.currentTarget.value)
                  }
                  className="h-14 text-xl "
                  type="name"
                  placeholder="Additional Details"
                />
                {/* <div className="text-sm text-gray-500 mb-2 flex items-start">
                  <CiCircleInfo className="mr-1 text-lg" />
                  <span>
                    We will send you an appropriate professional within this
                    time-frame
                  </span>
                </div> */}
              </>
            )}

            <div>
              <Button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 mb-[10vh] text-xl"
              >
                Schedule
              </Button>
            </div>
          </form>
        </div>
        <FloatingCallButton phoneNumber="1234567890" />
      </div>
    </>
  );
}
