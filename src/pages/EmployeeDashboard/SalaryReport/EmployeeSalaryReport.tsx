import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../AdminDashboard/SalaryReport/SalaryReport.css';
import { useUser } from '../../../lib/UserContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
const EmployeeSalaryReport = () => {
    const [users, setUsers] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const loggedInUser = useUser(); // Assuming useUser() is a custom hook providing logged-in user info
    const userEmail = loggedInUser?.user?.email;
    const [totalLateCount, setTotalLateCount] = useState(0);
    const [lateDeductions, setLateDeductions] = useState(0);
    const [overtimeAmount, setOvertimeAmount] = useState(0);
    const [mainSalary, setMainSalary] = useState(0);
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
    const filteredUser = users.find(user => user?.email === userEmail);
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
    useEffect(() => {
        // Calculate and update total late count
        const calculateTotalLateCount = () => {
            const lateCount = groupByDate(filteredUser?.attendanceRecords || []).reduce(
                (total, group) => total + (group.lateCount || 0),
                0
            );
            setTotalLateCount(lateCount);
        };

        const calculateTotalLateCountAndDeductions = () => {
            const lateCount = groupByDate(filteredUser?.attendanceRecords || []).reduce(
                (total, group) => total + (group.lateCount || 0),
                0
            );
            setTotalLateCount(lateCount);

            const deductions = Math.floor(lateCount / 3) * 1000; // Calculate deductions based on late count
            setLateDeductions(deductions);
        };

        const calculateOvertimeAndMainSalary = () => {
            const totalOvertime = groupByDate(filteredUser?.attendanceRecords || []).reduce(
                (total, group) => total + (group.overtime || 0),
                0
            );
            setOvertimeAmount(totalOvertime * hourlyRate);

            // Assuming main salary is fixed
            setMainSalary(filteredUser?.salary || 0);
        };

        calculateTotalLateCount();
        calculateTotalLateCountAndDeductions();
        calculateOvertimeAndMainSalary();
    }, [filteredUser?.attendanceRecords]);
    
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

            {filteredUser && (
                <div key={filteredUser._id} className="user-container">
                    <h3>{filteredUser.name}'s Salary Report</h3>
                    <p>Salary: {filteredUser.salary || 0} Tk</p>

                    {filteredUser.attendanceRecords && filteredUser.attendanceRecords.length > 0 && (
                        <div>
                            <h4>Overtime Details</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Total Overtime</th>
                                        <th>Overtime Money</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupByDate(filteredUser.attendanceRecords).map((group) => (
                                        <tr key={group.date}>
                                            <td>{group.date}</td>
                                            <td>{group.overtime} hours</td>
                                            <td>{group.overtime * hourlyRate} Tk</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <hr />
                    <p>Total Late Count: {totalLateCount} </p>
                    <hr />
                    <p>Salary Cut For Late Come: {lateDeductions} Tk</p>
                    <hr />
                    <p>Over Time Amount: {overtimeAmount} Tk</p>
                    <hr />
                    <p>Main Salary: {mainSalary} Tk</p>
                    <hr />
                    <p>
                        Total Salary: {mainSalary + overtimeAmount - lateDeductions} Tk
                    </p>
                    <hr />
                    
                    
                </div>
            )}

        </div>
    );
};

export default EmployeeSalaryReport;
