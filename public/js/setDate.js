//setting date 
const hiddenDate  =  new Date(document.getElementById("hiddenDate").value); 

function day_of_the_month(d)
{ 
  return (d.getDate() < 10 ? '0' : '') + d.getDate();
}

function month(d)
{ 
  const month = d.getMonth() + 1 ;
  return (month < 10 ? '0' : '') + month;
}
const finalDate = hiddenDate.getFullYear() + "-" +month(hiddenDate) + "-" + day_of_the_month(hiddenDate);

document.getElementById("pdate").defaultValue =  finalDate /*"2014-02-09"*/; 
