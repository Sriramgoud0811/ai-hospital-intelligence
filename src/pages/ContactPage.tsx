/**
 * Contact & Hospital Inquiries Page
 * Clinical contact channels, emergency hotlines, and physician/nurse consultation points.
 */

import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Stethoscope,
  Heart,
  Activity,
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import doctorImg from '../assets/images/doctor_portrait_1789729984838.jpg';
import nurseImg from '../assets/images/nurse_portrait_1789730000400.jpg';

export const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Inpatient Consultation',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ type: 'warning', title: 'Missing Information', message: 'Please fill out all required fields.' });
      return;
    }
    setSubmitted(true);
    toast({
      type: 'success',
      title: 'Inquiry Dispatched',
      message: 'Your message has been routed to the attending clinical care desk.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-950/60 border border-teal-800/40 text-teal-300 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span>24/7 Clinical Communications</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          Hospital Contact & Clinical Inquiries
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Reach our attending physician consultation desk, central nurse station, or patient care coordination team for inpatient inquiries and clinical evaluations.
        </p>
      </div>

      {/* Doctor & Nurse Direct Consultation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attending Physician Card */}
        <div className="p-6 rounded-3xl border border-teal-500/30 bg-slate-900/70 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center gap-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-teal-400/50 shadow-md">
            <img
              src={doctorImg}
              alt="Dr. Evelyn Reed, MD"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-950/80 border border-teal-700/50 text-[10px] font-semibold text-teal-300">
              <Stethoscope className="w-3 h-3" />
              <span>Attending Physician Desk</span>
            </div>
            <h3 className="text-base font-bold text-white">Dr. Evelyn Reed, MD</h3>
            <p className="text-xs text-teal-300 font-medium">Chief of Endocrinology & Triage</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct line for physician-to-physician consultations, inpatient risk assessment, and clinical protocols.
            </p>
            <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-xs">
              <span className="font-mono text-cyan-300 font-semibold">Ext. 811</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">evelyn.reed@hospital.org</span>
            </div>
          </div>
        </div>

        {/* Lead Clinical Nurse Specialist Card */}
        <div className="p-6 rounded-3xl border border-cyan-500/30 bg-slate-900/70 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center gap-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-cyan-400/50 shadow-md">
            <img
              src={nurseImg}
              alt="Marcus Vance, RN, BSN"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-700/50 text-[10px] font-semibold text-cyan-300">
              <Heart className="w-3 h-3" />
              <span>Central Nurse Station</span>
            </div>
            <h3 className="text-base font-bold text-white">Marcus Vance, RN, BSN</h3>
            <p className="text-xs text-cyan-300 font-medium">Lead Clinical Nurse Specialist</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Available 24/7 for inpatient bedside monitoring, care transition plans, and post-discharge continuity.
            </p>
            <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-xs">
              <span className="font-mono text-teal-300 font-semibold">Ext. 402</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">marcus.vance@hospital.org</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form & Hospital Emergency Hotlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info & Emergency Hotlines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-teal-400" />
              <span>Direct Emergency & Clinical Lines</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/20 space-y-1">
                <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider block">
                  Hospital Emergency Hotline
                </span>
                <p className="text-base font-mono font-bold text-white">(800) 412-CARE</p>
                <p className="text-slate-400 text-[11px]">Direct triage transfer line • 24/7</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider block">
                  Inpatient Telemetry Desk
                </span>
                <p className="text-base font-mono font-bold text-white">(800) 412-2287</p>
                <p className="text-slate-400 text-[11px]">Bed assignments & stay updates</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Metro Health Inpatient Pavilion, Wing C</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>24 Hours a Day • 7 Days a Week</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Message Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Inquiry Successfully Dispatched</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting AI Hospital Intelligence. Our clinical coordinators have received your transmission.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', department: 'General Inpatient Consultation', message: '' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] mb-4">
                  Send a Message to the Care Team
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Name <span className="text-teal-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 px-3.5 py-2.5 text-white"
                      placeholder="Dr. Jordan Hayes"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address <span className="text-teal-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 px-3.5 py-2.5 text-white"
                      placeholder="jordan.hayes@hospital.org"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Clinical Department or Specialty
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 px-3.5 py-2.5 text-white"
                  >
                    <option value="General Inpatient Consultation">General Inpatient Consultation</option>
                    <option value="Endocrinology & Diabetic Care">Endocrinology & Diabetic Care</option>
                    <option value="Discharge Planning & 30-Day Continuity">Discharge Planning & 30-Day Continuity</option>
                    <option value="Nursing Station & Bed Telemetry">Nursing Station & Bed Telemetry</option>
                    <option value="Hospital Administration">Hospital Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Clinical Inquiry or Request <span className="text-teal-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 px-3.5 py-2.5 text-white"
                    placeholder="Inquiring regarding patient risk scoring, length of stay planning, or department care coordination..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
