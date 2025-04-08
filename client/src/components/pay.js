import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

const Pay = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');

      // Make API call to fetch payments
      const response = await fetch('http://localhost:5000/api/courses/pay', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPayments(data.payments);  // Store payments in state
      } else {
        setError(data.message || 'Failed to fetch payments');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('An error occurred while fetching payments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();  // Call API when the component mounts
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <CircularProgress />
        <Typography variant="body1" style={{ marginTop: '10px' }}>
          Loading payments...
        </Typography>
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Payments List
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>User</strong></TableCell>
              <TableCell align="center"><strong>Course</strong></TableCell>
              <TableCell align="center"><strong>image</strong></TableCell>
              <TableCell align="center"><strong>Amount (₹)</strong></TableCell>
              <TableCell align="center"><strong>Order ID</strong></TableCell>
              <TableCell align="center"><strong>Payment ID</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
             <TableRow key={payment.paymentId}>
             <TableCell align="center">{payment.user ? payment.user.name : 'N/A'}</TableCell>
             <TableCell align="center">{payment.course ? payment.course.title : 'N/A'}</TableCell>
             <TableCell align="center">
               {payment.course && payment.course.image ? (
                 <img 
                   src={`http://localhost:5000/${payment.course.image}`} 
                   alt={payment.course.title || 'Course Image'} 
                   style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                 />
               ) : (
                 'N/A'
               )}
             </TableCell>
             <TableCell align="center">₹{payment.amount}</TableCell>
             <TableCell align="center">{payment.orderId || 'N/A'}</TableCell>
             <TableCell align="center">{payment.paymentId}</TableCell>
             <TableCell align="center">{payment.status}</TableCell>
             <TableCell align="center">{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
           </TableRow>
           
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Pay;
