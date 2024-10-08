import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './SalaryReport.css'; // Create a CSS file for styling
import { jsPDF } from 'jspdf';
const SalaryReport = () => {
    const [users, setUsers] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/users/get-all-users?month=${selectedMonth}`);
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedMonth]);

    

    // Constants
    const hourlyRate = 100; // Taka per hour

    // Months for the dropdown
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];
   

    // const handlePrint = () => {
    //     window.print(); // Trigger browser's print functionality
    // };
   
    const handlePrint = () => {
        const printContent = document.querySelector('.salary-report-container').innerHTML;
        const originalContent = document.body.innerHTML;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.body.innerHTML = printContent;

        // Call print() in the new window
        printWindow.print();

        // Restore original content after printing
        printWindow.onafterprint = () => {
            printWindow.close();
            document.body.innerHTML = originalContent;
        };
    };
    const handleDownloadPDF = async () => {
        const pdfContent = document.querySelector('.salary-report-container');

        if (!pdfContent) {
            console.error('Could not find the PDF content element');
            return;
        }

        const canvas = await html2canvas(pdfContent as HTMLElement);

        const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
        });

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);

        pdf.save('salary_report.pdf');
    };

    // Function to group attendance records by date and calculate total overtime for the selected month
    const groupByDate = (attendanceRecords) => {
        const grouped = {};
        attendanceRecords
            .filter(record => new Date(record.date).getMonth() === months.indexOf(selectedMonth)) // Filter records for the selected month
            .forEach((record) => {
                const date = new Date(record.date).toLocaleDateString();
                if (grouped[date]) {
                    grouped[date].overtime += parseInt(record.overtime) || 0;
                    grouped[date].lateCount += record.status === 'Late' ? 1 : 0;
                } else {
                    grouped[date] = {
                        date,
                        overtime: parseInt(record.overtime) || 0,
                        lateCount: record.status === 'Late' ? 1 : 0,
                    };
                }

                // Deduct 1000 taka if late count is 3 or more
                if (grouped[date].lateCount >= 3) {
                    grouped[date].deductedAmount = 1000;
                }
            });
        return Object.values(grouped);
    };
    // Function to calculate salary details for a single user
    const calculateSalaryDetails = (user) => {
        const groupedAttendance = groupByDate(user.attendanceRecords);
        const totalLateCount = groupedAttendance.reduce((total, group) => total + group.lateCount, 0);
        const lateDeductions = Math.floor(totalLateCount / 3) * 1000;
        const overtimeAmount = groupedAttendance.reduce((total, group) => total + group.overtime * hourlyRate, 0);
        const mainSalary = user.salary || 0;
        const totalSalary = mainSalary + overtimeAmount - lateDeductions;
        return { totalLateCount, lateDeductions, overtimeAmount, mainSalary, totalSalary };
    };


    return (
        <div className="salary-report-container">
            <h2>Salary Reports</h2>

            {/* Dropdown for selecting the month */}
            <label>Select Month: </label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option value="">Select a month</option>
                {months.map((month) => (
                    <option key={month} value={month}>
                        {month}
                    </option>
                ))}
            </select>
            <h1>Salary report of {selectedMonth}</h1>
            <button
                onClick={handlePrint}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
            >
                Print
            </button>
            <button
                onClick={handleDownloadPDF}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '10px',
                }}
            >
                Download PDF
            </button>

            {users.map((user) => (
                <div key={user._id} className="user-container">
                    <h3>{user.name}'s Salary Report</h3>
                    <p>Salary: {user.salary || 0} Tk</p>

                    {user.attendanceRecords && user.attendanceRecords.length > 0 && (
                        <div>
                            <h4>Overtime Details</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Total Overtime</th>
                                        {/* <th>Late Count</th> */}
                                        
                                        <th>Net Overtime Money</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupByDate(user.attendanceRecords).map((group) => (
                                        <tr key={group.date}>
                                            <td>{group.date}</td>
                                            <td>{group.overtime} hours</td>
                                            {/* <td>{group.lateCount}</td> */}
                                            
                                            <td>{(group.overtime * hourlyRate) - (group.deductedAmount || 0)} Tk</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <hr />
                    <p>Total Late Count: {calculateSalaryDetails(user).totalLateCount} </p>
                    <hr />
                    <p>Salary Cut For Late Come: {calculateSalaryDetails(user).lateDeductions} Tk</p>
                    <hr />
                    <p>Over Time Amount: {calculateSalaryDetails(user).overtimeAmount} Tk</p>
                    <hr />
                    <p>Main Salary: {calculateSalaryDetails(user).mainSalary} Tk</p>
                    <hr />
                    <p>
                        Total Salary: {calculateSalaryDetails(user).totalSalary} Tk
                    </p>
                    <hr />
                    
                    <hr />
                </div>
            ))}

        </div>
    );
};

export default SalaryReport;
