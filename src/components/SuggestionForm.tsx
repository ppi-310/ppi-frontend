'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';

type Option = { id: number; label: string };

type Props = {
  dimensions: Option[];
  granularities: Option[];
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function SuggestionForm({ dimensions, granularities }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dimensionId, setDimensionId] = useState<string>('');
  const [granularityId, setGranularityId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase.from('suggestion').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      id_dimension: dimensionId ? Number(dimensionId) : null,
      id_granularity: granularityId ? Number(granularityId) : null,
      message: message.trim(),
    });

    if (error) {
      console.error('suggestion insert error:', error);
      setErrorMsg(error.message || 'There was an error submitting your form.');
      setStatus('error');
      return;
    }

    // Reset
    setName('');
    setEmail('');
    setPhone('');
    setDimensionId('');
    setGranularityId('');
    setMessage('');
    setStatus('success');
  }

  return (
    <div className="contact1_form_sugg w-form">
      <form
        onSubmit={onSubmit}
        name="suggestion-form"
        className="contact1_form_sug"
      >
        <div className="form_field-2col">
          <div className="form_field-wrapper">
            <label htmlFor="suggestion-name" className="form_field-label">
              <strong>Name</strong>
            </label>
            <input
              className="form_input_contact_us w-input"
              maxLength={256}
              name="name"
              placeholder="Enter your name"
              type="text"
              id="suggestion-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form_field-2col is-mobile-1col">
          <div className="form_field-wrapper">
            <label htmlFor="suggestion-email" className="form_field-label">
              <strong>Email</strong>
            </label>
            <input
              className="form_input_contact_us w-input"
              maxLength={256}
              name="email"
              placeholder="Email"
              type="email"
              id="suggestion-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form_field-wrapper">
            <label htmlFor="suggestion-phone" className="form_field-label">
              <strong>Phone Number</strong>
            </label>
            <input
              className="form_input_contact_us w-input"
              maxLength={256}
              name="phone"
              placeholder="Number"
              type="tel"
              id="suggestion-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="form_field-wrapper">
          <label htmlFor="suggestion-dimension" className="form_field-label">
            <strong>Select a Dimension</strong>
          </label>
          <select
            id="suggestion-dimension"
            name="dimension"
            required
            className="form_input_contact_us is-select-input w-select"
            value={dimensionId}
            onChange={(e) => setDimensionId(e.target.value)}
          >
            <option value="">Choose One...</option>
            {dimensions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div className="padding-vertical padding-xsmall">
          <div className="form_field-wrapper">
            <label className="form_field-label">
              <strong>Granularity</strong>
            </label>
            <div className="spacer-xsmall"></div>
            <div className="w-layout-grid form_radio-2col">
              {granularities.map((g) => {
                const isChecked = granularityId === String(g.id);
                return (
                  <label
                    key={g.id}
                    className="form_radio w-radio"
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className={
                        'w-form-formradioinput w-form-formradioinput--inputType-custom form_radio-icon w-radio-input' +
                        (isChecked ? ' w--redirected-checked' : '')
                      }
                    ></div>
                    <input
                      type="radio"
                      name="granularity"
                      value={g.id}
                      checked={isChecked}
                      onChange={(e) => setGranularityId(e.target.value)}
                      style={{
                        opacity: 0,
                        position: 'absolute',
                        pointerEvents: 'none',
                      }}
                    />
                    <span className="form_radio-label w-form-label">
                      {g.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="form_field-wrapper">
          <label htmlFor="suggestion-message" className="form_field-label">
            <strong>Message</strong>
          </label>
          <textarea
            id="suggestion-message"
            name="message"
            maxLength={5000}
            placeholder="Detailed description of the proposed new PPI"
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
            <div className="success-text">Thank you! We&rsquo;ve received your suggestion.</div>
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
