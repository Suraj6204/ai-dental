import { getUserAppointments } from "@/lib/actions/appointments";
import { format, isAfter, isSameDay, parseISO } from "date-fns";
import NoNextAppointments from "./NoNextAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";

async function NextAppointment() {
  const { appointments } = await getUserAppointments();
  // filter for upcoming CONFIRMED appointments only (today or future)
  //return today or future appointments and ignores past appointments
  const upcomingAppointments = appointments?.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);  //2025-12-22T12:50:33.000Z -> Mon Dec 22 2025 18:20:33 GMT+0530

      const appointmentTime = appointment.time; // "10:30 AM"
      const isPM = appointmentTime.includes("PM");
      let hour = parseInt(appointmentTime.replace(/ AM| PM/, ""), 10);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      const formattedTime = `${hour.toString().padStart(2, "0")}:00:00`; // "14:30:00"

      const appointmentDateTime = new Date(`${appointment.date}T${formattedTime}`);
      const today = new Date();
      console.log("Comparing dates:", today, appointmentDateTime);
      const isUpcoming = today <= appointmentDateTime;
      return isUpcoming && appointment.status === "CONFIRMED";
    }) || [];

  const nextAppointment = upcomingAppointments[0];

  if (!nextAppointment) return <NoNextAppointments />; // no appointments, return nothing

  const appointmentDate = parseISO(nextAppointment.date);
  const formattedDate = format(appointmentDate, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(appointmentDate, new Date());

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="size-5 text-primary" />
          Next Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">
              {isToday ? "Today" : "Upcoming"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
            {nextAppointment.status}
          </span>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <UserIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{nextAppointment.doctorName}</p>
              <p className="text-xs text-muted-foreground">{nextAppointment.reason}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <CalendarIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{formattedDate}</p>
              <p className="text-xs text-muted-foreground">
                {isToday ? "Today" : format(appointmentDate, "EEEE")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClockIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{nextAppointment.time}</p>
              <p className="text-xs text-muted-foreground">Local time</p>
            </div>
          </div>
        </div>

        {/* More Appointments Count */}
        {upcomingAppointments.length > 1 && (
          <p className="text-xs text-center text-muted-foreground">
            +{upcomingAppointments.length - 1} more upcoming appointment
            {upcomingAppointments.length > 2 ? "s" : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default NextAppointment;
