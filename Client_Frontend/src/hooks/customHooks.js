const useConCatName = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
}

const useChangeDateFormat = (date) => {
    if (!date) return null; // Handle empty/null values ...

    const utcDate = new Date(date);
    const options = { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" };
    
    return new Intl.DateTimeFormat("en-CA", options).format(utcDate); // YYYY-MM-DD format ...
};

const useCalculateAge = (date) => {
    console.log(date);
    const currentDate = new Date();
    const enteredDate = new Date(date);
    let currentYear;
    let currentMonth;
    let currentDay;
    let yearGap;
    let monthGap;
    let dayGap;


    // Avoid the wrong dates ...
    if(currentDate.getFullYear() < enteredDate.getFullYear()) {
        console.log('Invalid Date Selection');
        return;
    }

    if(currentDate.getFullYear() == enteredDate.getFullYear() && currentDate.getMonth() < enteredDate.getMonth()) {
        console.log('Invalid Date Selection');
        return;
    }

    if(currentDate.getFullYear() == enteredDate.getFullYear() && currentDate.getMonth() == enteredDate.getMonth() && currentDate.getDate() < enteredDate.getDate()) {
        console.log('Invalid Date Selection');
        return;
    }

    if(currentDate.getMonth() < enteredDate.getMonth() && currentDate.getDate() > enteredDate.getDate()){
        // console.log('Condition 1 Running');
        currentYear = currentDate.getFullYear() - 1;
        currentMonth = currentDate.getMonth() + 12;
        yearGap = currentYear - enteredDate.getFullYear();
        monthGap = currentMonth - enteredDate.getMonth();
        dayGap = currentDate.getDate() - enteredDate.getDate();
    } else if(currentDate.getMonth() > enteredDate.getMonth() && currentDate.getDate() < enteredDate.getDate()){
        // console.log('Condition 2 Running');
        currentMonth = currentDate.getMonth() - 1;
        currentDay = currentDate.getDate() + 30;
        yearGap = currentDate.getFullYear() - enteredDate.getFullYear();
        monthGap = currentMonth - enteredDate.getMonth();
        dayGap = currentDay - enteredDate.getDate();
    } else if(currentDate.getDate() < enteredDate.getDate() && currentDate.getDate() < enteredDate.getDate()){
        // console.log('Condition 3 Running');
        currentYear = currentDate.getFullYear() - 1;
        currentMonth = (currentDate.getMonth() - 1) + 12;
        currentDay = currentDate.getDate() + 30;
        yearGap = currentYear - enteredDate.getFullYear();
        monthGap = currentMonth - enteredDate.getMonth();
        dayGap = currentDay - enteredDate.getDate();
    } else {
        // console.log('Else Part Running');
        yearGap = currentDate.getFullYear() - enteredDate.getFullYear();
        monthGap = currentDate.getMonth() - enteredDate.getMonth();
        dayGap = currentDate.getDate() - enteredDate.getDate();
    }

    return `${yearGap} Years`;

    // return `${yearGap} Years - ${monthGap} Months - ${dayGap} Days`;
}

const useSetUserProfileCompletion = (user) => {
    console.log(user);
    let filledDataCount = 0;

    

    for(let key in user) {
        if(user[key] != '' && user[key] != null && user[key] != undefined) {
            filledDataCount++;
        }
    }

    const totalFields = Object.entries(user).length - 3;

    // console.log('Data Count', filledDataCount);
    // console.log('Total Fields', totalFields); // Have to remove createdAt, userId and password ...

    const filledDataPercentage = ((filledDataCount - 3) / (totalFields - 3)) * 100;
    return `${Math.ceil(filledDataPercentage)}%`;
}

const useCheckValidCVFile = (file) => {
    const allowedTypes = [
        "application/pdf", //.pdf ...
        "application/msword", // .doc ...
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx ...
    ]

    if(!allowedTypes.includes(file.type)) {
        return false;
    }

    return true;
} 

const useCheckValidImageFile = (file) => {
    const allowedImageTypes = [
        "image/png", 
        "image/jpeg", 
        "image/jpg", 
        "image/gif", 
        "image/webp"
    ]; 

    if(!allowedImageTypes.includes(file.type)) {
        return false;
    } 

    return true;
}

export { useConCatName, useChangeDateFormat, useCalculateAge, useSetUserProfileCompletion, useCheckValidImageFile, useCheckValidCVFile };