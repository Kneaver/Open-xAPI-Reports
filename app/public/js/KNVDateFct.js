// KNVDateFct released here will be open sourced later as an NPM module
// Timestamps
var OneSecond = 1000;
var OneMinute = 60*OneSecond;
var OneHour = 60*OneMinute;
var OneDay = 24*OneHour;
var OneWeek = 7*OneDay;

// Date manipulations
function FormatDateTime( InputDate1, Mode)
{
    // InputDate1 cld be a string
    var InputDate = new Date( InputDate1);
    // was RFC2822
    // RSChange(1224,BW,2014.10.10,"October Week 2 Updated")
    if ( Mode == 1)
        return InputDate.toDateString();
    else
    if ( Mode == 3)
       return InputDate.toTimeString();
    // RSChangeEnd(1224)
    return InputDate.toDateString() + InputDate.toTimeString(); 
}

function FirstMondayOfYear( Year)
{
    var StartTime = new Date( Year, 0, 1, 7, 0);
    // Next Monday will be first Monday of Month
    var DayInWeek = 1;
    if ( StartTime.getDay() < DayInWeek)
      StartTime.setDate( StartTime.getDate() + ( DayInWeek - StartTime.getDay()));
    else
    if ( StartTime.getDay() > DayInWeek)
      StartTime.setDate( StartTime.getDate() + ( 7 + DayInWeek - StartTime.getDay()));
    return StartTime;
}

function MondayOfYearOrWeek( Year, Week)
{
    var StartTime = FirstMondayOfYear( Year);
    // Next Monday will be first Monday of Month
    var DayInWeek = 1;
    if ( StartTime.getDay() < DayInWeek)
      StartTime.setDate( StartTime.getDate() + ( DayInWeek - StartTime.getDay()));
    else
    if ( StartTime.getDay() > DayInWeek)
      StartTime.setDate( StartTime.getDate() + ( 7 + DayInWeek - StartTime.getDay()));
    // Add weeks
    StartTime.setTime( StartTime.getTime() + ( Week - 1) * OneWeek);
    return StartTime;
}

function WeekOfYear( d1)
{
    var StartTime = FirstMondayOfYear( d1.getFullYear());
    var Weeks = Math.ceil((d1.getTime() - StartTime.getTime()) / OneWeek);
    return Weeks;
}

function RSLNGCst( txt) {return txt;}

function PrintTodayOrYesterdayWithTag( DayToPrint, Day)
{
    return ' <html:abbr title="' + DayToPrint + '">' + Day + '</html:abbr> ';
}

function DocWriteLocalDateDayOnly( d)
{
    // display today and yesterday instead of date
    // Today and Yesterday must be computed in User time
    // recent = less than 2 days
    var DayToPrint = d.toLocaleDateString();
    // Test for today must be done in local time
    var Today = new Date();
    // All arithmetic on Date are only possibleof Time in milliseconds, no helper fcts in API see RI729
    // Being Today in Local time means being between Midnight and next Midnight
    // So we reset Today Hours
    // This is 0 AM
    Today.setHours( 0,0,0,0);
    var OneDayinMilliSecond = 24*60*60*1000;
    if (( d.getTime() >= Today.getTime()) && ( d.getTime() <= Today.getTime() + OneDayinMilliSecond))
    {
        DayToPrint = PrintTodayOrYesterdayWithTag( DayToPrint, RSLNGCst( 'Today'));
    }
    else
    if (( d.getTime() >= Today.getTime() - OneDayinMilliSecond) && ( d.getTime() <= Today.getTime()))
    {
        DayToPrint = PrintTodayOrYesterdayWithTag( DayToPrint, RSLNGCst( 'Yesterday'));
    }
    else
    {
        // Prevent date to be splitted
        var re;
        re = / /g;
        // Tue Oct 23 2009 1:53 PM
        DayToPrint = d.toDateString();
        DayToPrint = DayToPrint.replace( re, "&nbsp;");
    }
    // I want to highlight recent elements. Not asked by Bruno
    // highlight = use of css class KNVRecentItemsDate
    var Recent = ( ( Today.getTime() + OneDayinMilliSecond - d.getTime()) <= 2*OneDayinMilliSecond);
    if(Recent)
    {
        // RSChange(1224,BW,2014.10.10,"October Week 2 Updated")
        return '<span class="KNVRecentItemsDate">' + DayToPrint + '</span>';
        // RSChangeEnd(1224)
    }
    else
    {
        // RSChange(1224,BW,2014.10.10,"October Week 2 Updated")
        return DayToPrint;
        // RSChangeEnd(1224)
    }
}

function DocWriteLocalHourInDay( d)
{
    // The toLocaleTimeString returns the time with seconds as a String
    // There is no API to get the local time without seconds
    // I am using the split method to manipulate the result of toLocaleTimeString
    var TimeString = d.toLocaleTimeString().split(":");
    // TimeString[2] is splitted again to get AM/PM
    // RSChange(1224,BW,2014.10.10,"October Week 2 Updated")
    var TimeString2 = TimeString[2].toString().split(" ");
    return "&nbsp;" + TimeString[0] + ":" + TimeString[1] + "&nbsp;" + TimeString2[1]
    // RSChangeEnd(1224)
}

if (typeof exports !== 'undefined')
{
    exports.FormatDateTime = FormatDateTime;
    exports.FirstMondayOfYear = FirstMondayOfYear;
    exports.MondayOfYearOrWeek = MondayOfYearOrWeek;
    exports.WeekOfYear = WeekOfYear;
    exports.OneSecond = OneSecond;
    exports.OneMinute = OneMinute;
    exports.OneHour = OneHour;
    exports.OneDay = OneDay;
    exports.OneWeek = OneWeek;
}
