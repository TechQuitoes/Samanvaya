import {
  AccommodationType,
  TaskPriority,
  TaskStatus,
  TransportMode,
  TravelStatus,
} from "@/types/travel";
import {
  Plane,
  Train,
  Car,
  CarTaxiFront,
  Bus,
  Navigation,
} from "lucide-react";

export const POPULAR_CITIES = [
  "Vrindavan",
  "Mayapur",
  "Mumbai",
  "Delhi",
  "Puri",
  "Bangalore",
  "Hyderabad",
  "Kolkata",
  "Chennai",
  "Ahmedabad",
  "Pune",
  "Jaipur",
  "Tirupati",
  "Udupi",
  "Dwarka",
  "Ayodhya",
  "Varanasi",
  "Kurukshetra",
  "Haridwar",
  "Rishikesh",
];

export const PURPOSE_OPTIONS = [
  "Official Visit",
  "Pilgrimage / Yatra",
  "Preaching & Temple Seva Tour",
  "Festival / Rath Yatra",
  "Temple Inauguration / Opening",
  "Diksha Ceremony",
  "Youth / Community Camp",
  "Personal / Retreat",
];

export const STAY_TYPE_OPTIONS = [
  { value: AccommodationType.TEMPLE, label: "ISKCON Guest House / Temple" },
  { value: AccommodationType.HOTEL, label: "Hotel" },
  { value: AccommodationType.ASHRAM, label: "Ashram" },
  { value: AccommodationType.DHARAMSHALA, label: "Dharamshala" },
  { value: AccommodationType.OTHER, label: "Devotee Residence / Other" },
];

export const STATUS_OPTIONS = [
  { value: TravelStatus.UPCOMING, label: "Upcoming" },
  { value: TravelStatus.ONGOING, label: "Ongoing" },
  { value: TravelStatus.COMPLETED, label: "Completed" },
];

export const SEAT_PREFERENCE_OPTIONS = [
  { value: "Window", label: "Window" },
  { value: "Aisle", label: "Aisle" },
  { value: "Middle", label: "Middle" },
  { value: "Extra Legroom", label: "Extra Legroom" },
];

export const TRAIN_QUOTA_OPTIONS = [
  { value: "General", label: "General" },
  { value: "Tatkal", label: "Tatkal" },
  { value: "Senior Citizen", label: "Senior Citizen" },
  { value: "Ladies", label: "Ladies" },
];

export const BUS_TYPE_OPTIONS = [
  { value: "Volvo Multi-Axle AC Sleeper", label: "Volvo Multi-Axle AC Sleeper" },
  { value: "AC Seater", label: "AC Seater" },
  { value: "Non-AC Sleeper", label: "Non-AC Sleeper" },
];

export const DOC_CATEGORY_OPTIONS = [
  { value: "Ticket", label: "Flight / Train Ticket" },
  { value: "Hotel Booking", label: "Hotel / Guest House PDF" },
  { value: "ID Proof", label: "Aadhar / Passport / ID" },
  { value: "Invitation", label: "Invitation Letter" },
  { value: "Invoice", label: "Travel Invoice / Bill" },
];

export const POPULAR_AIRLINES = [
  "IndiGo",
  "Air India",
  "Vistara",
  "Akasa Air",
  "SpiceJet",
  "AIX Connect (AirAsia India)",
  "Alliance Air",
  "Emirates",
  "Qatar Airways",
  "Singapore Airlines",
  "Etihad Airways",
  "Lufthansa",
  "British Airways",
  "Other / Chartered",
];

export const TASK_PRIORITY_OPTIONS = [
  { value: TaskPriority.HIGH, label: "High" },
  { value: TaskPriority.MEDIUM, label: "Medium" },
  { value: TaskPriority.LOW, label: "Low" },
];

export const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.PENDING, label: "Not Started" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.COMPLETED, label: "Completed" },
];

export const DEVOTEE_ASSIGNEES = [
  { value: "Madhav Das", label: "Madhav Das (Coordinator)" },
  { value: "Govinda Das", label: "Govinda Das (Guest House Seva)" },
  { value: "Praveen Sharma", label: "Praveen Sharma (Travel Incharge)" },
  { value: "Shubham Verma", label: "Shubham Verma (Logistics)" },
  { value: "Darshan Kumar", label: "Darshan Kumar (Accounts)" },
];

export const TRANSPORT_MODES = [
  { mode: TransportMode.FLIGHT, label: "Flight", icon: Plane, desc: "Airlines & Air transit" },
  { mode: TransportMode.TRAIN, label: "Train", icon: Train, desc: "Railways & Express" },
  { mode: TransportMode.CAR, label: "Car", icon: Car, desc: "Self-driven or Rental" },
  { mode: TransportMode.PICKUP, label: "Pickup / Cab", icon: CarTaxiFront, desc: "Chauffeur & Local transit" },
  { mode: TransportMode.BUS, label: "Bus", icon: Bus, desc: "Intercity coach or Sleeper" },
  { mode: TransportMode.OTHER, label: "Other", icon: Navigation, desc: "Ferry, Rickshaw, Custom" },
];
