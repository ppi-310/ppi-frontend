'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase.from('contact_message').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim(),
    });

    if (error) {
      console.error('contact_message insert error:', error);
      setErrorMsg(error.message || 'There was an error submitting your form.');
      setStatus('error');
      return;
    }

    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setStatus('success');
  }

  return (
    <div className="contact2_form_contac w-form">
      <form
        onSubmit={onSubmit}
        name="contact-form"
        className="contact1_form_sug"
      >
        <div className="form_field-2col">
          <div className="form_field-wrapper">
            <label htmlFor="contact-name" className="form_field-label">
              <strong>Name</strong>
            </label>
            <input
              className="form_input_contact_us w-input"
              maxLength={256}
              name="name"
              placeholder="Enter your name"
              type="text"
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form_field-2col is-mobile-1col">
          <div className="form_field-wrapper">
            <label htmlFor="contact-email" className="form_field-label">
              <strong>Email</strong>
            </label>
            <input
              className="form_input_contact_us w-input"
              maxLength={256}
              name="email"
              placeholder="Email"
              type="email"
              id="contact-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form_field-wrapper">
            <label htmlFor="contact-phone" className="form_field-label">
              <strong>Phone Number</strong>
            </label>
            <input
              className="form_input_contact_us w-input"
              maxLength={256}
              name="phone"
              placeholder="Number"
              type="tel"
              id="contact-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="padding-vertical padding-xsmall"></div>
        <div className="form_field-wrapper">
          <label htmlFor="contact-message" className="form_field-label">
            <strong>Message</strong>
          </label>
          <textarea
            id="contact-message"
            name="message"
            maxLength={5000}
            placeholder="Just send us your questions or concerns by starting a new case and we will give you the help you need."
            required
            className="form_input_contact_us is-text-area w-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <input
          type="submit"
          disabled={status === 'submitting'}
          className="button-2 w-button"
          value={status === 'submitting' ? 'Please wait...' : 'Submit'}
        />
      </form>

      {status === 'success' && (
        <div className="form_message-success-wrapper w-form-done" style={{ display: 'block' }}>
          <div className="form_message-success">
            <div className="success-text">Thank you! We&rsquo;ve received your message.</div>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="form_message-error-wrapper w-form-fail" style={{ display: 'block' }}>
          <div className="form_message-error">
            <div className="error-text">
              Oops! There was an error submitting your form.
              {errorMsg && <span> ({errorMsg})</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
