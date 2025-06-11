
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, parse, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import SectionTitle from '@/components/ui/section-title';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Loader2, Send } from 'lucide-react';
import { appointmentServices, appointmentStaff, appointmentTimeSlots } from '@/lib/data';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';


const appointmentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name is too long."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits.").max(15, "Phone number is too long."),
  service: z.string().min(1, "Please select a service."),
  preferredStaff: z.string().min(1, "Please select a staff member or 'Any Available'."),
  preferredDate: z.date({
    required_error: "A preferred date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  preferredTime: z.string().min(1, "Please select a preferred time slot."),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

async function submitAppointmentForm(data: AppointmentFormValues): Promise<{ success: boolean; message: string }> {
  console.log("Appointment Form data submitted:", data);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, message: "Your appointment request has been submitted! We'll contact you shortly to confirm." };
}

export default function AppointmentBookingPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayWeekStartDate, setDisplayWeekStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [formCardRef, isFormCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      preferredStaff: '',
      preferredDate: undefined,
      preferredTime: '',
      notes: '',
    },
  });

  const selectedDate = form.watch('preferredDate');
  const selectedTime = form.watch('preferredTime');

  useEffect(() => {
    if (selectedDate) {
      setDisplayWeekStartDate(startOfWeek(selectedDate, { weekStartsOn: 1 }));
    } else {
      const today = new Date();
      if (!selectedDate || !isSameDay(startOfWeek(selectedDate, { weekStartsOn: 1 }), displayWeekStartDate)) {
        setDisplayWeekStartDate(startOfWeek(today, { weekStartsOn: 1 }));
      }
    }
  }, [selectedDate, displayWeekStartDate]); // Added displayWeekStartDate to dependencies


  const weekDays = eachDayOfInterval({
    start: displayWeekStartDate,
    end: endOfWeek(displayWeekStartDate, { weekStartsOn: 1 }),
  });

  const handleDateSelect = (date: Date) => {
    form.setValue('preferredDate', date, { shouldValidate: true });
  };

  const handleTimeSelect = (timeSlot: string) => {
    form.setValue('preferredTime', timeSlot, { shouldValidate: true });
  };

  const goToPreviousWeek = () => {
    setDisplayWeekStartDate(subWeeks(displayWeekStartDate, 1));
  };

  const goToNextWeek = () => {
    setDisplayWeekStartDate(addWeeks(displayWeekStartDate, 1));
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const morningSlots = appointmentTimeSlots.filter(slot => {
    const startTimeString = slot.split(' - ')[0];
    const [time, modifier] = startTimeString.split(' ');
    let [hours] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0; 
    return hours < 12;
  });

  const afternoonSlots = appointmentTimeSlots.filter(slot => {
    const startTimeString = slot.split(' - ')[0];
    const [time, modifier] = startTimeString.split(' ');
    let [hours] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours >= 12;
  });


  async function onSubmit(values: AppointmentFormValues) {
    setIsSubmitting(true);
    try {
      const result = await submitAppointmentForm(values);
      if (result.success) {
        toast({
          title: "Request Submitted!",
          description: result.message,
          variant: "default",
        });
        form.reset({ 
            name: '',
            email: '',
            phone: '',
            service: '',
            preferredStaff: '',
            preferredDate: undefined, 
            preferredTime: '',
            notes: '',
        });
        setDisplayWeekStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));

      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-12">
      <div ref={titleSectionRef} className={cn("transition-all duration-700 ease-out", isTitleSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Book Your Appointment"
          subtitle="Schedule a session with our expert advisors for personalized guidance on your educational journey."
        />
      </div>

      <div ref={formCardRef} className={cn("transition-all duration-700 ease-out", isFormCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Card className="max-w-4xl mx-auto shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-primary">Appointment Details</CardTitle>
            <CardDescription>Please fill out the form below to request an appointment.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Column 1: Personal Details & Service */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input type="tel" placeholder="e.g., +977 98XXXXXXXX" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Required</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {appointmentServices.map(service => (
                              <SelectItem key={service.value} value={service.value}>{service.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredStaff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Staff Member</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a staff member" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {appointmentStaff.map(staff => (
                              <SelectItem key={staff.value} value={staff.value}>{staff.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Any specific questions or details..." {...field} rows={4} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Column 2: Date & Time Selection */}
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a Date"}
                    </h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Preferred Date</FormLabel>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Button variant="outline" size="icon" onClick={goToPreviousWeek} type="button">
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="font-medium text-primary">
                              {format(displayWeekStartDate, "MMMM yyyy")}
                            </div>
                            <Button variant="outline" size="icon" onClick={goToNextWeek} type="button">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {weekDays.map((day) => {
                              const isPastDay = day < today;
                              return (
                                  <Button
                                    key={day.toString()}
                                    variant={isSameDay(day, selectedDate || new Date(0)) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => !isPastDay && handleDateSelect(day)}
                                    disabled={isPastDay}
                                    className={cn(
                                      "flex flex-col h-auto p-2",
                                      isPastDay && "text-muted-foreground opacity-50 cursor-not-allowed",
                                      !isPastDay && isSameDay(day, selectedDate || new Date(0)) && "bg-primary text-primary-foreground",
                                      !isPastDay && !isSameDay(day, selectedDate || new Date(0)) && "hover:bg-accent hover:text-accent-foreground"
                                    )}
                                    type="button"
                                  >
                                    <span className="text-xs">{format(day, "EEE")}</span>
                                    <span>{format(day, "d")}</span>
                                  </Button>
                              );
                            })}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Preferred Time Slot</FormLabel>
                          <div className="space-y-4">
                          {selectedDate ? (
                          <>
                            {morningSlots.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Morning</h4>
                                <div className="grid grid-cols-3 gap-2">
                                  {morningSlots.map((slot) => (
                                    <Button
                                      key={slot}
                                      variant={selectedTime === slot ? "default" : "outline"}
                                      onClick={() => handleTimeSelect(slot)}
                                      className={cn(selectedTime === slot && "bg-primary text-primary-foreground")}
                                      type="button"
                                    >
                                      {slot.split(' - ')[0]}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {afternoonSlots.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Afternoon</h4>
                                <div className="grid grid-cols-3 gap-2">
                                  {afternoonSlots.map((slot) => (
                                    <Button
                                      key={slot}
                                      variant={selectedTime === slot ? "default" : "outline"}
                                      onClick={() => handleTimeSelect(slot)}
                                      className={cn(selectedTime === slot && "bg-primary text-primary-foreground")}
                                      type="button"
                                    >
                                      {slot.split(' - ')[0]}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {morningSlots.length === 0 && afternoonSlots.length === 0 && (
                                  <p className="text-sm text-muted-foreground text-center py-4">No time slots available for this day.</p>
                            )}
                          </>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">Please select a date to see available time slots.</p>
                          )}
                          </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="md:col-span-2 pt-6">
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Request Appointment
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
