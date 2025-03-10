import React, { useEffect } from 'react';

const Maintenance = () => {
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#080808E6', // Dark background
            padding: '0 20px',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            color: '#f0f0f0', // Light text color
        },
        iconContainer: {
            width: '120px',
            height: '120px',
            backgroundColor: '#2d2d2d', // Darker gray
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)', // Deeper shadow
        },
        icon: {
            fontSize: '60px',
        },
        heading: {
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 20px 0',
            color: '#ffffff', // Bright white for heading
        },
        subheading: {
            fontSize: '20px',
            fontWeight: 'normal',
            margin: '0 0 30px 0',
            color: '#b0b0b0', // Light gray
        },
        message: {
            fontSize: '16px',
            maxWidth: '600px',
            lineHeight: '1.6',
            marginBottom: '40px',
            color: '#b0b0b0', // Light gray
        },
        contactInfo: {
            fontSize: '16px',
            color: '#b0b0b0', // Light gray
            marginBottom: '30px',
        },
        footer: {
            fontSize: '14px',
            color: '#666666', // Darker gray for footer
            position: 'absolute',
            bottom: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.iconContainer}>
                <div style={styles.icon}>🛠️</div>
            </div>
            <h1 style={styles.heading}>Site Under Maintenance</h1>
            <h2 style={styles.subheading}>We'll be back soon!</h2>
            <p style={styles.message}>
                We're currently performing scheduled maintenance on our website to improve your experience.
                Our team is working hard to bring you an even better service. Please check back soon.
                We apologize for any inconvenience this may cause.
            </p>
            <div style={styles.contactInfo}>
                Need immediate assistance? Contact us at <strong><a href='mailto:devxoshakya@gmail.com'>devxoshakya@gmail.com</a></strong>
            </div>
            
        </div>
    );
};

export default Maintenance;