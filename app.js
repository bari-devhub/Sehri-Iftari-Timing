const today=new Date();
document.getElementById("gregDate").innerText=today.toDateString();

function convertTo12(timeStr){
    let clean=timeStr.split(" ")[0];
    let [hour,minute]=clean.split(":");
    hour=parseInt(hour);
    let ampm=hour>=12?"PM":"AM";
    hour=hour%12;
    hour=hour?hour:12;
    return `${hour}:${minute} ${ampm}`;
}

let timer;
document.getElementById("city").addEventListener("input",function(){
    clearTimeout(timer);
    timer=setTimeout(()=>{
        if(this.value.trim()!==""){
            fetchTimings(this.value.trim());
        }
    },350);
});

async function fetchTimings(city){
    let d=new Date();
    let formattedDate=`${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;

    const sunni=await fetch(`https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${city}&country=Pakistan&method=1`);
    const shia=await fetch(`https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${city}&country=Pakistan&method=0`);

    const dataSunni=await sunni.json();
    const dataShia=await shia.json();

    if(dataSunni.code===200){
        const hijri=dataSunni.data.date.hijri;
        document.getElementById("hijriHeading").innerText=
            `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

        document.getElementById("sehriSunni").innerText=
            convertTo12(dataSunni.data.timings.Fajr);

        document.getElementById("iftarSunni").innerText=
            convertTo12(dataSunni.data.timings.Maghrib);

        document.getElementById("sehriShia").innerText=
            convertTo12(dataShia.data.timings.Imsak);

        document.getElementById("iftarShia").innerText=
            convertTo12(dataShia.data.timings.Maghrib);
    }
}
