"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Star,
  Sparkles,
  Gift,
  Calendar,
  Camera,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Crown,
  Gem,
} from "lucide-react";
import images from "@/images";

export default function Page() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);
  const [clientMounted, setClientMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const birthdayMessages = [
    "Happy 28th Birthday, My Beautiful Queen! 👑",
    "Another year of incredible memories together ✨",
    "You light up every room you enter 💫",
    "Here&apos;s to endless adventures with you! 🌟",
    "You&apos;re the most precious gift in my life 💎",
    "Every moment with you is magical ✨",
    "Your smile makes my world complete 😊",
    "Growing more beautiful with each passing year 🌸",
    "You&apos;re my favorite person in the universe 💕",
    "Here&apos;s to celebrating YOU today! 🎉",
    "My heart belongs to you forever ❤️",
    "You make ordinary days extraordinary 🌈",
  ];

  const loveQuotes = [
    "In your eyes, I found my home 🏡",
    "You are my today and all of my tomorrows 💫",
    "Every love story is beautiful, but ours is my favorite 📖",
    "With you, I am home 🏠",
    "You are my sunshine on cloudy days ☀️",
  ];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Client-side mounting effect (fixes hydration)
  useEffect(() => {
    setClientMounted(true);
  }, []);

  // Initialize audio settings
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.7; // Set comfortable volume
      audio.muted = false;
    }
  }, []);

  // Music effect
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isLoaded) {
      // Try to play music immediately
      const tryPlayMusic = () => {
        audio
          .play()
          .then(() => {
            // Music is playing successfully, set state to true
            setIsMusicPlaying(true);
            setIsMusicMuted(false);
            setShowMusicPrompt(false);
          })
          .catch(() => {
            // Autoplay blocked - keep state as false so user knows to click
            setIsMusicPlaying(false);
            setIsMusicMuted(false);
            // Show prompt after a delay to encourage user interaction
            setTimeout(() => setShowMusicPrompt(true), 3000);
            console.log("Autoplay blocked - will try on user interaction");
          });
      };

      // Try immediately
      tryPlayMusic();

      // Also try after a short delay
      const playTimer = setTimeout(tryPlayMusic, 500);

      // Try to play on first user interaction only
      let hasTriedOnInteraction = false;
      const startMusicOnInteraction = () => {
        if (!hasTriedOnInteraction && !isMusicPlaying) {
          hasTriedOnInteraction = true;
          tryPlayMusic();
          // Remove listeners after first attempt
          document.removeEventListener("click", startMusicOnInteraction);
          document.removeEventListener("touchstart", startMusicOnInteraction);
          document.removeEventListener("keydown", startMusicOnInteraction);
          document.removeEventListener("scroll", startMusicOnInteraction);
        }
      };

      // Add event listeners for user interactions (only for initial autoplay attempt)
      document.addEventListener("click", startMusicOnInteraction);
      document.addEventListener("touchstart", startMusicOnInteraction);
      document.addEventListener("keydown", startMusicOnInteraction);
      document.addEventListener("scroll", startMusicOnInteraction);

      return () => {
        clearTimeout(playTimer);
        document.removeEventListener("click", startMusicOnInteraction);
        document.removeEventListener("touchstart", startMusicOnInteraction);
        document.removeEventListener("keydown", startMusicOnInteraction);
        document.removeEventListener("scroll", startMusicOnInteraction);
      };
    }
  }, [isLoaded, isMusicPlaying]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      // If music is not playing at all, start it first
      if (audio.paused) {
        audio.volume = 0.7; // Set normal volume
        audio
          .play()
          .then(() => {
            setIsMusicPlaying(true);
            setIsMusicMuted(false);
            setShowMusicPrompt(false);
          })
          .catch((error) => {
            setIsMusicPlaying(false);
            console.log("Could not play audio:", error);
          });
      } else {
        // Music is playing, toggle mute/unmute
        if (isMusicMuted) {
          // Unmute the music
          audio.volume = 0.7;
          setIsMusicMuted(false);
        } else {
          // Mute the music (but keep it playing)
          audio.volume = 0;
          setIsMusicMuted(true);
        }
        setShowMusicPrompt(false);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="text-center flex flex-col items-center justify-center max-w-sm mx-auto relative z-10">
          {/* Beautiful enhanced spinner */}
          <div className="relative mb-6 sm:mb-8">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 bg-gradient-to-r from-pink-400 to-purple-400 opacity-30 blur-lg animate-pulse"></div>

            {/* Main spinner */}
            <div className="relative animate-spin rounded-full h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 p-1">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50"></div>
            </div>

            {/* Inner decorative ring */}
            <div className="absolute inset-3 sm:inset-4 rounded-full border-2 border-pink-200/50 animate-pulse"></div>

            {/* Center sparkle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-pink-500 animate-pulse h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>

          {/* Beautiful text with decorative elements */}
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="text-yellow-500 animate-bounce h-5 w-5 sm:h-6 sm:w-6" />
              <Star className="text-pink-400 animate-pulse h-4 w-4 sm:h-5 sm:w-5" />
              <Crown className="text-yellow-500 animate-bounce h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-rose-500 bg-clip-text text-transparent animate-pulse leading-tight mb-2">
              Preparing something special for Sophie...
            </p>

            <div className="flex items-center justify-center gap-1">
              <div
                className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden">
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        autoPlay
        preload="auto"
        className="hidden"
        onPlay={() => {
          setIsMusicPlaying(true);
          if (audioRef.current && audioRef.current.volume === 0) {
            setIsMusicMuted(true);
          }
        }}
        onPause={() => setIsMusicPlaying(false)}
        onEnded={() => setIsMusicPlaying(false)}
        onVolumeChange={() => {
          if (audioRef.current) {
            setIsMusicMuted(audioRef.current.volume === 0);
          }
        }}
      >
        <source src="/music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 via-purple-200/30 to-rose-200/30 animate-pulse"></div>
        <div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-pink-100/20 to-transparent"
          style={{
            transform: `translate(${mousePosition.x / 50}px, ${
              mousePosition.y / 50
            }px)`,
            transition: "transform 0.1s ease-out",
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      {clientMounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => {
            const icons = [Heart, Star, Sparkles, Crown, Gem];
            const Icon = icons[i % icons.length];
            return (
              <div
                key={i}
                className="absolute animate-float hidden sm:block"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                }}
              >
                <Icon
                  className="text-pink-300/60 animate-pulse"
                  size={12 + Math.random() * 16}
                />
              </div>
            );
          })}
          {/* Fewer particles for mobile */}
          {[...Array(8)].map((_, i) => {
            const icons = [Heart, Star, Sparkles, Crown, Gem];
            const Icon = icons[i % icons.length];
            return (
              <div
                key={`mobile-${i}`}
                className="absolute animate-float block sm:hidden"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                }}
              >
                <Icon
                  className="text-pink-300/60 animate-pulse"
                  size={10 + Math.random() * 12}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Header with fancy animations */}
      <header className="relative z-10 py-6 md:py-12 text-center animate-in fade-in-0 slide-in-from-top-4 duration-1000 px-4">
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Sparkles className="text-pink-500 animate-spin" size={20} />
          <Crown className="text-yellow-500 animate-bounce" size={18} />
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-rose-500 bg-clip-text text-transparent animate-pulse leading-tight">
            Happy Birthday Sophie!
          </h1>
          <Crown className="text-yellow-500 animate-bounce" size={18} />
          <Sparkles className="text-pink-500 animate-spin" size={20} />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 md:mb-8">
          <Badge
            variant="secondary"
            className="text-sm sm:text-lg md:text-xl px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200 animate-pulse"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            28 Years of Magic
          </Badge>
          <Badge
            variant="secondary"
            className="text-sm sm:text-lg md:text-xl px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-100 to-rose-100 border-purple-200 animate-pulse"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Special Queen
          </Badge>
        </div>
      </header>

      {/* Music Control Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleMusic}
          variant="outline"
          size="icon"
          className={`bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/30 hover:text-gray-900 transition-all duration-300 h-12 w-12 hover:scale-110 touch-manipulation shadow-lg ${
            !isMusicPlaying
              ? "text-gray-500 border-gray-200"
              : isMusicMuted
              ? "text-red-500 border-red-200"
              : "text-green-600 border-green-200"
          }`}
          title={
            !isMusicPlaying
              ? "Click to play birthday music 🎵"
              : isMusicMuted
              ? "Music is muted - click to unmute 🔇"
              : "Music is playing - click to mute 🔊"
          }
        >
          {!isMusicPlaying ? (
            <Volume2 size={18} />
          ) : isMusicMuted ? (
            <VolumeX size={18} />
          ) : (
            <Volume2 size={18} />
          )}
        </Button>
      </div>

      {/* Music Prompt (shows if autoplay failed) */}
      {showMusicPrompt && !isMusicPlaying && !isMusicMuted && (
        <div className="fixed top-20 right-4 z-50 max-w-xs">
          <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-200 shadow-xl animate-in slide-in-from-top-4 duration-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="text-pink-500" size={16} />
                <span className="text-sm font-semibold text-gray-700">
                  🎵 Birthday Music Available!
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Click the music button above to start Sophie&apos;s special
                birthday soundtrack
              </p>
              <Button
                onClick={() => {
                  toggleMusic();
                  setShowMusicPrompt(false);
                }}
                size="sm"
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
              >
                🎶 Play Music
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hero Section with enhanced design */}
      <section className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 mb-8 md:mb-16">
        <div className="relative">
          <Card className="overflow-hidden shadow-2xl bg-white/95 backdrop-blur-sm border-2 border-pink-200/50 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000">
            <CardContent className="p-0">
              <div
                className="relative h-[450px] sm:h-[550px] md:h-[700px]"
                ref={heroRef}
              >
                {/* Main Image with 3:4 aspect ratio optimization */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                  <div className="relative w-full h-full max-w-[525px] mx-auto">
                    <Image
                      src={images[currentImageIndex]}
                      alt={`Memory ${currentImageIndex + 1}`}
                      fill
                      className="object-cover rounded-lg shadow-2xl transition-all duration-1000 ease-in-out hover:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, 525px"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg"></div>
                  </div>
                </div>

                {/* Floating Message */}
                <div className="absolute bottom-4  sm:bottom-8 left-2 sm:left-4 md:left-8 right-2 sm:right-4 md:right-8 text-white z-10">
                  <div className="bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20">
                    <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 animate-pulse leading-tight">
                      {birthdayMessages[currentImageIndex]}
                    </h2>
                    <p className="text-sm sm:text-base md:text-xl opacity-90 mb-2 sm:mb-3">
                      {loveQuotes[currentImageIndex % loveQuotes.length]}
                    </p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm opacity-80">
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>
                        Memory {currentImageIndex + 1} of {images.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Navigation */}
                <Button
                  onClick={prevImage}
                  variant="outline"
                  size="icon"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/30 text-white hover:text-white transition-all duration-300 h-10 w-10 sm:h-12 sm:w-12 hover:scale-110 touch-manipulation"
                >
                  <ChevronLeft size={20} className="md:text-gray-500" />
                </Button>
                <Button
                  onClick={nextImage}
                  variant="outline"
                  size="icon"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/30 text-white hover:text-white transition-all duration-300 h-10 w-10 sm:h-12 sm:w-12 hover:scale-110 touch-manipulation"
                >
                  <ChevronRight size={20} className="md:text-gray-500" />
                </Button>

                {/* Auto-play control */}
                <Button
                  onClick={toggleAutoPlay}
                  variant="outline"
                  size="icon"
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/30 text-white hover:text-white transition-all duration-300 h-10 w-10 sm:h-12 sm:w-12 touch-manipulation"
                >
                  {isAutoPlaying ? (
                    <Pause size={14} className="md:text-gray-500" />
                  ) : (
                    <Play size={14} className="md:text-gray-500" />
                  )}
                </Button>

                {/* Image indicators */}
                <div className="absolute bottom-1 sm:bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 px-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                        index === currentImageIndex
                          ? "bg-white w-6 sm:w-8"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Photo Gallery */}
      <section className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 mb-8 md:mb-16">
        <div className="text-center mb-6 md:mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center justify-center gap-2 sm:gap-3">
            <Camera className="text-pink-500 animate-bounce" size={28} />
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Our Beautiful Journey
            </span>
            <Gem className="text-purple-500 animate-bounce" size={28} />
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Every picture tells a story of our love, laughter, and endless
            adventures together ❤️
          </p>
          <Separator className="w-16 sm:w-24 mx-auto mt-4 md:mt-6 bg-gradient-to-r from-pink-500 to-purple-500 h-1" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
          {images.map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-pink-200 touch-manipulation">
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={image}
                        alt={`Memory ${index + 1}`}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-white/30">
                          <Heart
                            className="text-white animate-pulse"
                            size={16}
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs sm:text-sm font-semibold bg-black/40 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1">
                          Memory #{index + 1}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-4xl w-full h-[80vh] p-0">
                <DialogTitle className="sr-only">
                  Memory {index + 1} - Photo Gallery
                </DialogTitle>
                <div className="relative w-full h-full flex items-center justify-center bg-black/90">
                  <Image
                    src={image}
                    alt={`Memory ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="95vw"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>

      {/* Enhanced Birthday Message */}
      <section className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4 mb-8 md:mb-16">
        <Card className="bg-gradient-to-r from-pink-100 via-purple-100 to-rose-100 shadow-2xl border-2 border-pink-200/50 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000">
          <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12 text-center">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Star className="text-yellow-500 animate-pulse" size={32} />
              <Crown className="text-yellow-500 animate-bounce" size={36} />
              <Star className="text-yellow-500 animate-pulse" size={32} />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 sm:mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              28 Years of You Being Absolutely Incredible! 🎂
            </h2>

            <div className="max-w-3xl mx-auto">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Today we celebrate not just another year, but another year of
                your amazing spirit, your beautiful heart, and all the joy you
                bring to everyone around you. You make every ordinary moment
                feel extraordinary, and I&apos;m so grateful to share this
                incredible journey with you.
              </p>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                {[
                  {
                    icon: Heart,
                    text: "Endless Love",
                    color: "from-pink-500 to-red-500",
                  },
                  {
                    icon: Star,
                    text: "Pure Joy",
                    color: "from-yellow-500 to-orange-500",
                  },
                  {
                    icon: Sparkles,
                    text: "Magic Moments",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: Crown,
                    text: "My Queen",
                    color: "from-yellow-500 to-yellow-600",
                  },
                  {
                    icon: Gem,
                    text: "Precious Memories",
                    color: "from-blue-500 to-purple-500",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={`text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r ${item.color} text-white border-0 hover:scale-105 transition-transform duration-300 touch-manipulation`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2 animate-pulse" />
                      {item.text}
                    </Badge>
                  );
                })}
              </div>

              <Button
                onClick={() => setShowMessage(!showMessage)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg lg:text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 touch-manipulation"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 animate-pulse" />
                {showMessage ? "Hide" : "Show"} My Heart&apos;s Message 💌
              </Button>

              {showMessage && (
                <Card className="mt-6 sm:mt-8 bg-white/90 backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-4 duration-500 border-2 border-pink-200/50 shadow-xl">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center justify-center mb-4 sm:mb-6">
                      <Heart
                        className="text-pink-500 animate-pulse"
                        size={24}
                      />
                    </div>
                    <p className="text-gray-700 italic text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                      &ldquo;Happy Birthday, Sophie!
                      <br />
                      <br />
                      I can&apos;t believe your birthday is here again—and for
                      the first time in two years, I&apos;m not in Taiwan to
                      celebrate it with you. Even when I had work before, I
                      still flew back just to be with you on this special day.
                      <br />
                      <br />
                      This year, I&apos;m in Canada, pursuing my goals and
                      dreams. But I&apos;m really happy that You&apos;ll be
                      visiting on July 22, which means I still get the chance to
                      celebrate your birthday with you—just a little late.
                      <br />
                      <br />
                      Over these past three years, we&apos;ve been through so
                      much together. I&apos;ve come to know the real you—your
                      personality, your kindness, your caring nature.
                      You&apos;re such a sweet and thoughtful person, and
                      it&apos;s been unforgettable living and working in Taiwan
                      with you.
                      <br />
                      <br />
                      I&apos;ll always miss our little day trips with your
                      family and the way we explored the city together. Thank
                      you for showing me so many wonderful places around Taiwan.
                      Even though I used to grumble about the food, every
                      experience became special because you were there with me.
                      <br />
                      <br />I hope we&apos;ll create even more amazing memories
                      together in the future. Wishing you a wonderful birthday
                      filled with love and happiness! 🎂💕&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
                      <Heart
                        className="text-pink-500 animate-pulse"
                        size={16}
                      />
                      <span className="text-gray-600 font-semibold text-sm sm:text-base">
                        Forever yours
                      </span>
                      <Heart
                        className="text-pink-500 animate-pulse"
                        size={16}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 py-8 sm:py-12 text-center px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Heart className="text-pink-500 animate-pulse" size={20} />
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-semibold leading-tight">
            Made with infinite love for Sophie&apos;s 28th Birthday
          </p>
          <Heart className="text-pink-500 animate-pulse" size={20} />
        </div>
        <div className="flex justify-center items-center gap-2 sm:gap-3">
          <Sparkles className="text-purple-500 animate-pulse" size={14} />
          <span className="text-sm sm:text-base text-gray-500">
            {new Date().getFullYear()} • A Year of Beautiful Memories
          </span>
          <Sparkles className="text-purple-500 animate-pulse" size={14} />
        </div>
      </footer>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
