import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  const featuresRef = useRef(null);
  const [activeDemo, setActiveDemo] = useState("planning");
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#2C3E50] text-white" ref={containerRef}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50] to-[#1e3c5a]"></div>

        {/* Floating Elements - Purely decorative */}
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 left-[10%] w-16 h-16 rounded-full bg-[#1ABC9C]/20 backdrop-blur-md"
        />

        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/3 right-[15%] w-24 h-24 rounded-full bg-blue-500/10 backdrop-blur-md"
        />

        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                GoalMate – Your Personal Productivity Partner
              </h1>
              <p className="text-2xl font-semibold text-[#1ABC9C] mb-4">
                AI-powered goal achievement companion
              </p>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Break down your ambitious goals into manageable steps with our
                AI assistant. Stay organized, track progress, and achieve more.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105 shadow-lg inline-block text-center"
                >
                  Get Started
                </Link>
                <button
                  onClick={scrollToFeatures}
                  className="bg-transparent border-2 border-[#1ABC9C] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all hover:bg-[#1ABC9C]/10 inline-block text-center"
                >
                  Learn More
                </button>
              </div>

              {/* Stats counter */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1ABC9C]">10k+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1ABC9C]">50k+</div>
                  <div className="text-sm text-gray-400">Goals Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1ABC9C]">95%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="#1e293b"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,186.7C672,192,768,192,864,176C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Demo Section - NEW */}
      <section className="bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">See GoalMate in Action</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience how our platform transforms your goals into actionable
              plans
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setActiveDemo("planning")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeDemo === "planning"
                      ? "bg-[#1ABC9C] text-white"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  1. Planning
                </button>
                <button
                  onClick={() => setActiveDemo("tracking")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeDemo === "tracking"
                      ? "bg-[#1ABC9C] text-white"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  2. Tracking
                </button>
                <button
                  onClick={() => setActiveDemo("completion")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeDemo === "completion"
                      ? "bg-[#1ABC9C] text-white"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  3. Completion
                </button>
              </div>

              {/* Demo Content */}
              {activeDemo === "planning" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-slate-800 p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-semibold mb-4">
                    AI Goal Planning
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Just tell GoalMate what you want to achieve, and our AI
                    assistant will create a structured plan with:
                  </p>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li className="flex items-start">
                      <span className="text-[#1ABC9C] mr-2">✓</span>
                      Clear objectives and measurable outcomes
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1ABC9C] mr-2">✓</span>
                      Step-by-step tasks with priorities
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1ABC9C] mr-2">✓</span>
                      Realistic timeline and deadlines
                    </li>
                  </ul>
                  <p className="text-gray-400 italic">
                    "I want to learn JavaScript in 2 months."
                  </p>
                </motion.div>
              )}

              {activeDemo === "tracking" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-slate-800 p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-semibold mb-4">
                    Progress Tracking
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Stay motivated with our intuitive progress tracking system:
                  </p>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li className="flex items-start">
                      <span className="text-[#1ABC9C] mr-2">✓</span>
                      Visual progress bars and metrics
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1ABC9C] mr-2">✓</span>
                      Task completion recording
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1ABC9C] mr-2">✓</span>
                      Milestone celebrations
                    </li>
                  </ul>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className="bg-[#1ABC9C] h-2.5 rounded-full w-[65%]"></div>
                  </div>
                  <p className="text-right text-sm text-gray-400">
                    65% Complete
                  </p>
                </motion.div>
              )}

              {activeDemo === "completion" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-slate-800 p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-semibold mb-4">
                    Goal Achievement
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Celebrate your success and keep building momentum:
                  </p>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li className="flex items-start">
                      <span className="text-[#1ABC9C] mr-2">✓</span>
                      Achievement badges and certificates
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1ABC9C] mr-2">✓</span>
                      Goal history and reflection
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#1ABC9C] mr-2">✓</span>
                      Suggestions for next challenges
                    </li>
                  </ul>
                  <div className="text-center py-2 bg-[#1ABC9C]/20 rounded-lg">
                    <span className="text-[#1ABC9C] font-bold">
                      Mission Accomplished!
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Mockup Display */}
            <div className="relative">
              <div className="bg-slate-800 rounded-xl p-3 shadow-2xl relative">
                <div className="rounded-lg overflow-hidden border-2 border-slate-700">
                  <img
                    src={
                      activeDemo === "planning"
                        ? "https://placehold.co/600x400/1e293b/1ABC9C?text=AI+Planning"
                        : activeDemo === "tracking"
                        ? "https://placehold.co/600x400/1e293b/1ABC9C?text=Progress+Tracking"
                        : "https://placehold.co/600x400/1e293b/1ABC9C?text=Goal+Achievement"
                    }
                    alt="GoalMate Demo"
                    className="w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/4 h-[6px] bg-slate-700 rounded-full"></div>
              </div>

              {/* Decorative elements */}
              <motion.div
                style={{ y }}
                className="absolute -right-5 -bottom-5 w-20 h-20 bg-[#1ABC9C]/20 rounded-full blur-xl"
              />
              <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
                className="absolute -left-10 -top-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How GoalMate Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform helps you achieve your goals through a
              simple 3-step process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="bg-[#1ABC9C]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#1ABC9C]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Define Your Goal</h3>
              <p className="text-gray-300">
                Share your ambitions with our AI coach. Whether it's learning a
                skill, planning a project, or building a habit, we've got you
                covered.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="bg-[#1ABC9C]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#1ABC9C]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Get a Structured Plan
              </h3>
              <p className="text-gray-300">
                Our AI breaks down your goal into manageable steps with
                priorities and deadlines, creating a clear roadmap to success.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="bg-[#1ABC9C]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#1ABC9C]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Track Your Progress
              </h3>
              <p className="text-gray-300">
                Complete tasks, monitor your progress, and stay motivated with
                visual progress tracking and timely reminders.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - NEW */}
      <section className="bg-[#2C3E50] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get answers to common questions about GoalMate
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion title="What makes GoalMate different from other productivity apps?">
              GoalMate uses AI to understand your specific needs and creates
              personalized action plans. Unlike generic to-do apps, we break
              down complex goals into manageable steps with priorities and
              deadlines tailored to your situation.
            </Accordion>

            <Accordion title="Do I need technical skills to use GoalMate?">
              Not at all! GoalMate is designed for everyone. Just tell our AI
              what you want to achieve in simple language, and it will create a
              structured plan for you. The interface is user-friendly and
              intuitive.
            </Accordion>

            <Accordion title="Can I track multiple goals at once?">
              Absolutely! You can create and track as many goals as you want.
              GoalMate helps you manage multiple projects or learning paths
              simultaneously without getting overwhelmed.
            </Accordion>

            <Accordion title="Is my data private and secure?">
              Yes, we take privacy seriously. Your goals and personal
              information are encrypted and never shared with third parties. You
              maintain full control of your data and can delete it anytime.
            </Accordion>

            <Accordion title="Is there a free plan available?">
              Yes! GoalMate offers a free plan that includes basic goal planning
              and tracking. For advanced features like unlimited goals, detailed
              analytics, and priority support, check out our premium plans.
            </Accordion>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#2C3E50]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of productive users who've achieved their goals
              with GoalMate
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  J
                </div>
                <div>
                  <h4 className="font-semibold">James Wilson</h4>
                  <p className="text-sm text-gray-400">Web Developer</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "GoalMate helped me learn React.js in just 8 weeks with its
                structured approach. The AI broke down the learning path
                perfectly!"
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  S
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-400">Project Manager</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "As a project manager, I use GoalMate to plan complex projects.
                It's like having an assistant that helps me stay organized."
              </p>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-semibold">Michael Brown</h4>
                  <p className="text-sm text-gray-400">Fitness Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "I've tried many apps, but GoalMate's AI understood my fitness
                goals and created a plan that kept me motivated throughout my
                journey."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1e3c5a] to-[#2C3E50]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Achieve Your Goals?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who are turning their dreams into reality
              with GoalMate's AI-powered planning.
            </p>
            <Link
              to="/signup"
              className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105 shadow-lg inline-block text-center"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Accordion component for FAQs
const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full bg-slate-800 p-5 rounded-lg text-left focus:outline-none group"
      >
        <span className="font-medium">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="bg-slate-800/50 p-5 rounded-b-lg mt-1 text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
