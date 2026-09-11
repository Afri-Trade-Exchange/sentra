import { Timestamp } from 'firebase/firestore';
import { Activity, Consignment, ConsignmentStatus, NotificationType, TimelineEvent } from './types';

export const generateMockConsignments = (): Consignment[] => {
  const statuses = Object.values(ConsignmentStatus);
  const documentTypes = ['Import', 'Export', 'Transit'];
  const traderNames = [
    { name: 'John Oludhe', email: 'Oludhe@gmail.com' },
    { name: 'Bob Smith', email: 'bob@gmail.com' },
    { name: 'Cynthia Wanjiru', email: 'cynthia@gmail.com' },
    { name: 'Diana Induli', email: 'diana@gmail.com' },
    { name: 'Ethan Kajala', email: 'ethan@gmail.com' },
    { name: 'Fiona Wangari', email: 'fiona@gmail.com' },
    { name: 'George Ouko', email: 'george@gmail.com' },
    { name: 'Hannah Aoko', email: 'hannah@gmail.com' },
    { name: 'Ian Malcolm', email: 'ian@gmail.com' },
    { name: 'Jessica Wambui', email: 'jessica@gmail.com' }
  ];

  return Array.from({ length: 20 }).map((_, index) => ({
    id: `consignment-${index + 1}`,
    traderName: traderNames[index % traderNames.length].name,
    traderEmail: traderNames[index % traderNames.length].email,
    documentType: documentTypes[index % documentTypes.length],
    status: statuses[index % statuses.length] as ConsignmentStatus,
    uploadDate: Timestamp.now(),
    details: {
      declarationNumber: `DCL-${index + 1000}`,
      description: 'Commercial goods',
      estimatedValue: Math.floor(Math.random() * 100000),
      goodsOrdered: ['Item A', 'Item B', 'Item C'],
      goodsStatus: 'In Transit'
    }
  }));
};

export const generateMockActivities = (): Activity[] => {
  return Array.from({ length: 5 }).map((_, index) => ({
    id: `activity-${index}`,
    description: `Activity ${index + 1} description`,
    timestamp: new Date(Date.now() - index * 86400000),
    type: ['status_change', 'document_upload', 'comment', 'review'][index % 4] as Activity['type'],
    userId: `user-${index}`
  }));
};

export const generateMockNotifications = (): NotificationType[] => {
  return Array.from({ length: 3 }).map((_, index) => ({
    id: `notification-${index}`,
    message: `Notification ${index + 1} message`,
    timestamp: new Date(Date.now() - index * 3600000),
    read: index > 0,
    type: ['info', 'warning', 'success', 'error'][index % 4] as NotificationType['type']
  }));
};

export const generateMockTimelineEvents = (): TimelineEvent[] => {
  return Array.from({ length: 4 }).map((_, index) => ({
    id: `timeline-${index}`,
    title: `Event ${index + 1}`,
    timestamp: new Date(Date.now() - index * 86400000),
    status: Object.values(ConsignmentStatus)[index % 3],
    description: `Timeline event ${index + 1} description`
  }));
};
