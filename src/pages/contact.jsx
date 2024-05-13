import React, { useEffect } from 'react';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify'; // Import the Flip transition



emailjs.init("n5Tbm4utYd9SNopVB"); // Replace with your actual EmailJS public API key

const Contact = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Policy & Terms'; // Set the title when the component mounts
    return () => {
      // Reset the title to the previous one when the component unmounts
      document.title = previousTitle;
    };
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Collect form data
    const email = e.target.email.value;
    const subject = e.target.subject.value;
    const message = e.target.message.value;

    // Set up EmailJS parameters
    const serviceID = "service_7mfvpja";
    const templateID = "template_k39u3fc";

    // Send the email
    emailjs.send(serviceID, templateID, {
      from_email: email,
      name: subject,
      message: `message from ${email}: \n subject - ${subject} \n  ${message}`,
    }).then(function (response) {
      console.log("Email sent successfully!");
      // Reset the form
      e.target.reset();
    }).catch(function (error) {
      console.error("Email sending failed:", error);
    });

    toast.success('Submit successful!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
        });

  };


  return (
    
    <div className="mt-[-2rem] bg-black pt-32 pb-28">
      <div className="max-w-md mx-auto px-4 py-8 text-base leading-6 text-white">
        <h1 className="font-bold text-3xl mb-4">Contact Us</h1>
        <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="outline-none block font-semibold mb-2">Your Email</label>
            <input type="email" id="email" name="email" placeholder='name@example.com' className="outline-none block h-8 w-full bg-[#222222] rounded shadow-sm p-2 text-sm" required />
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="outline-none block font-semibold mb-2">Subject</label>
            <input type="text" id="subject" name="subject" className="outline-none block w-full rounded bg-[#222222] shadow-sm h-8 p-2" required />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="outline-none block font-semibold mb-2">Message</label>
            <textarea id="message" name="message" rows="4" className="outline-none block w-full rounded h-32 bg-[#222222] shadow-sm p-2"></textarea>
          </div>
          <button type="submit" className="bg-[#222222] text-white py-2 px-8 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Send</button>
        </form>
      </div>
      <ToastContainer
  position="top-center"
  autoClose={3000}
  hideProgressBar
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
  transition="Flip"
/>

    </div>

  );
}

export default Contact;
