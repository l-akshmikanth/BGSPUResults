let studentData = [];

// Function to convert number to words
function numberToWords(num) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    function convert(n) {
        if (n < 10) return units[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + units[n % 10] : '');
        if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
    }

    return convert(num);
}

// Fetch student data from JSON file
fetch('results.json')
    .then(response => response.json())
    .then(data => {
        studentData = data.Sheet1;
    })
    .catch(error => {
        console.error('Error loading student data:', error);
    });

function searchResults() {
    const studentID = document.getElementById('studentID').value;
    const student = studentData.find(s => s.slNo == studentID); // Use loose equality to match both strings and numbers

    if (student) {
        document.getElementById('student-name').innerText = `Student Name: ${student.name}`;
        document.getElementById('student-id').innerText = `Student ID: ${student.slNo}`;

        // Calculate and set all subject marks
        const subjects = [
            { id: 'kannada', max: 80, marks: toNumber(student.kannada_theory) },
            { id: 'english', max: 80, marks: toNumber(student.english_theory) },
            { id: 'physics', max: 70, marks: toNumber(student.physics_theory) + toNumber(student.physics_practical) },
            { id: 'chemistry', max: 70, marks: toNumber(student.chemistry_theory) + toNumber(student.chemistry_practical) },
            { id: 'mathematics', max: 80, marks: toNumber(student.mathematics_theory) },
            { id: 'biology', max: 70, marks: toNumber(student.biology_theory) + toNumber(student.biology_practical) },
        ];

        let grandTotal = 0;

        subjects.forEach(subject => {
            const subjectResult = document.getElementById(`${subject.id}-result`);
            if (subjectResult) {
                subjectResult.innerText = subject.marks;
            }
            grandTotal += subject.marks;
        });

        document.getElementById('grand-total').innerText = grandTotal;

        // Calculate percentage
        const percentage = ((grandTotal / 450) * 100).toFixed(2);
        document.getElementById('percentage').innerText = percentage;

        // Set total marks in words
        document.getElementById('marks-in-words').innerText = numberToWords(grandTotal);

        // Determine class obtained
        let classObtained;
        if (percentage >= 85) classObtained = "DISTINCTION";
        else if (percentage >= 60) classObtained = "FIRST CLASS";
        else if (percentage >= 50) classObtained = "SECOND CLASS";
        else if (percentage >= 35) classObtained = "PASS CLASS";
        else classObtained = "FAIL";

        document.getElementById('class-obtained').innerText = classObtained;
        document.getElementById('final-result').innerText = `${classObtained} (Total: ${grandTotal})`;

        document.getElementById('result-section').style.display = 'block';
    } else {
        alert("No results found for the given Student ID.");
        document.getElementById('result-section').style.display = 'none';
    }
}

// Convert value to number, defaulting to 0 if not a number
function toNumber(value) {
    return parseInt(value) || 0;
}



function printMarksheet() {
    window.print();
}
