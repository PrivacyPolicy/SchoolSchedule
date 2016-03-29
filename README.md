# SchoolSchedule
Calculates all schedules that fit certain criteria

I created this to specifically accomodate my own classes and schedule, so it does not contain some important features such as a large range of time or fancy functionality.
Note: At present, this is only guaranteed to work correctly in Chrome.


HOW TO USE:

Input the class data. You have two options to do so: 

1. Upon downloading the repository, open schedule.html. Enter the information requested.
   A "course" represents a subject that can be taught, whereas a "class" is a specific
   session of a course taught by a professor at a certain time. There can be many classes
   for a single course.
   Entering the data this way is more user-friendly, but won't save if the browser is
   closed or reloaded.

2. The slightly more complicated way: open the source file schedule.js and modify the
   first two variables "courses" and "classes" to accomidate your schedule. There are
   commented examples in the file. This method has the advantage of staying across
   browser sessions, but is slightly harder to enter.

Next, change the conditions to your liking. It's best to start very strict and reduce
your requirements until a schedule fits your needs.

Note: it may appear to freeze during operation, which is normal. Just wait it out, it is calculating.



TODO:
- Provide fancier interface to be more user-friendly for the engineers
- Allow easier input of time data... because military-time text-input sucks
- Scrape data from CAMS, because this is made for the Poly students, but until then:
- Save the data to avoid requiring the user to re-enter all the time
