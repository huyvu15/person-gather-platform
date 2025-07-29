'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  const transitionDelay = 0.7
  const buttonAnimationVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    whileHover: { scale: 1.02 },
    whileTap: { scale: 1.01 },
  }
  
  const heroAnimationVariants = {
    initial: { opacity: 0, y: 5, scaleX: 1 },
    animate: { opacity: 1, y: 0, scaleX: 1 },
  }

  const polaroidVariants = {
    initial: { opacity: 0, rotate: -5, y: 20 },
    animate: { opacity: 1, rotate: 0, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white flex items-center justify-center px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-32">
        {/* Left Section - Polaroid Stack */}
        <div className="relative w-full max-w-md lg:max-w-lg">
          {/* Polaroid Photos Stack */}
          <motion.div
            className="relative"
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Back Polaroid */}
            <motion.div
              className="absolute -bottom-4 -right-4 w-64 h-80 bg-white rounded-lg shadow-lg transform rotate-6"
              variants={polaroidVariants}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="p-3">
                <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-pink-500 rounded"></div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-handwriting text-gray-700">Luding fon, Us</p>
                </div>
              </div>
            </motion.div>

            {/* Middle Polaroid */}
            <motion.div
              className="absolute -bottom-2 -right-2 w-64 h-80 bg-white rounded-lg shadow-lg transform -rotate-3"
              variants={polaroidVariants}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="p-3">
                <div className="w-full h-48 bg-gradient-to-br from-orange-300 to-yellow-400 rounded"></div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-handwriting text-gray-700">Car</p>
                </div>
              </div>
            </motion.div>

            {/* Front Polaroid */}
            <motion.div
              className="relative w-64 h-80 bg-white rounded-lg shadow-xl transform rotate-2"
              variants={polaroidVariants}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="p-3">
                <div className="w-full h-48 bg-gradient-to-br from-orange-500 to-red-500 rounded relative overflow-hidden">
                  {/* Ferris wheel silhouette */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16">
                    <div className="w-full h-full border-4 border-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white rounded-full"></div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-handwriting text-gray-700">Dubai, AE</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Section - Text and Buttons */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 max-w-lg">
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-1200 tracking-tight"
            variants={heroAnimationVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 * transitionDelay, duration: 0.4 }}
          >
            Capture Your
          </motion.h1>
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight"
            variants={heroAnimationVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 2.3 * transitionDelay, duration: 0.7 }}
          >
            Travel Memories
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-md"
            variants={heroAnimationVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 * transitionDelay, duration: 0.7 }}
          >
            Collect, share and remember your adventures in a space that celebrates
            the essence of exploration.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            variants={heroAnimationVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 * transitionDelay, duration: 0.7 }}
          >
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-colors duration-300 shadow-lg"
              variants={buttonAnimationVariants}
              initial="initial"
              animate="animate"
              whileHover="whileHover"
              whileTap="whileTap"
            >
              <Link href="/memories" className="block w-full h-full flex items-center justify-center">
                Get Started
              </Link>
            </motion.button>
            <motion.button
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl transition-colors duration-300 shadow-lg border border-gray-200"
              variants={buttonAnimationVariants}
              initial="initial"
              animate="animate"
              whileHover="whileHover"
              whileTap="whileTap"
            >
              <Link href="/memories" className="block w-full h-full flex items-center justify-center">
                Discover
              </Link>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 