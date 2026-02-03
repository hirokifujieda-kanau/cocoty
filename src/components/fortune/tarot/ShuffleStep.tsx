import React from 'react';
import Image from 'next/image';

interface ShuffleStepProps {
  onComplete?: () => void;
}

export const ShuffleStep: React.FC<ShuffleStepProps> = ({ onComplete }) => {
  const cards = [
    { duration: 5.0, delay: 0, tilt: 15 },
    { duration: 4.8, delay: 0.2, tilt: -20 },
    { duration: 5.2, delay: 0.4, tilt: 0 },
    { duration: 4.9, delay: 0.1, tilt: 25 },
    { duration: 5.1, delay: 0.3, tilt: -10 },
    { duration: 4.7, delay: 0.5, tilt: 18 },
    { duration: 5.3, delay: 0.6, tilt: -15 },
  ];

  return (
    <div className="text-center">
      <div className="relative w-full max-w-md mx-auto h-80 flex items-start justify-center pt-12">
        {cards.map((card, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              animationName: `float${index}`,
              animationDuration: `${card.duration}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${card.delay}s`,
              zIndex: index,
            }}
          >
            <Image
              src="/tarot-material/tarot_default.svg"
              alt="タロットカード"
              width={50}
              height={75}
              className="drop-shadow-xl"
              style={{ transform: `rotate(${card.tilt}deg)` }}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes float0 {
          0% { transform: translate(-50%, -50%) translate(40px, 0px) rotate(0deg); opacity: 1; }
          5% { transform: translate(-50%, -50%) translate(38.0px, -12.3px) rotate(18deg); opacity: 1; }
          10% { transform: translate(-50%, -50%) translate(32.4px, -23.5px) rotate(36deg); opacity: 1; }
          15% { transform: translate(-50%, -50%) translate(23.5px, -32.4px) rotate(54deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) translate(12.3px, -38.0px) rotate(72deg); opacity: 1; }
          25% { transform: translate(-50%, -50%) translate(0px, -40px) rotate(90deg); opacity: 1; }
          30% { transform: translate(-50%, -50%) translate(-12.3px, -38.0px) rotate(108deg); opacity: 1; }
          35% { transform: translate(-50%, -50%) translate(-23.5px, -32.4px) rotate(126deg); opacity: 1; }
          40% { transform: translate(-50%, -50%) translate(-32.4px, -23.5px) rotate(144deg); opacity: 1; }
          45% { transform: translate(-50%, -50%) translate(-38.0px, -12.3px) rotate(162deg); opacity: 1; }
          50% { transform: translate(-50%, -50%) translate(-40px, 0px) rotate(180deg); opacity: 1; }
          55% { transform: translate(-50%, -50%) translate(-38.0px, 12.3px) rotate(198deg); opacity: 1; }
          60% { transform: translate(-50%, -50%) translate(-32.4px, 23.5px) rotate(216deg); opacity: 1; }
          65% { transform: translate(-50%, -50%) translate(-23.5px, 32.4px) rotate(234deg); opacity: 1; }
          70% { transform: translate(-50%, -50%) translate(-12.3px, 38.0px) rotate(252deg); opacity: 1; }
          75% { transform: translate(-50%, -50%) translate(0px, 40px) rotate(270deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) translate(12.3px, 38.0px) rotate(288deg); opacity: 1; }
          85% { transform: translate(-50%, -50%) translate(23.5px, 32.4px) rotate(306deg); opacity: 1; }
          90% { transform: translate(-50%, -50%) translate(32.4px, 23.5px) rotate(324deg); opacity: 1; }
          95% { transform: translate(-50%, -50%) translate(38.0px, 12.3px) rotate(342deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(40px, 0px) rotate(360deg); opacity: 1; }
        }
          37.5% { transform: translate(-50%, -50%) translate(-56.6px, -56.6px) rotate(135deg); opacity: 0.95; }
          43.75% { transform: translate(-50%, -50%) translate(-70.7px, -30px) rotate(157.5deg); opacity: 0.92; }
          50% { transform: translate(-50%, -50%) translate(-80px, 0px) rotate(180deg); opacity: 0.85; }
          56.25% { transform: translate(-50%, -50%) translate(-70.7px, 30px) rotate(202.5deg); opacity: 0.87; }
          62.5% { transform: translate(-50%, -50%) translate(-56.6px, 56.6px) rotate(225deg); opacity: 0.9; }
          68.75% { transform: translate(-50%, -50%) translate(-30px, 70.7px) rotate(247.5deg); opacity: 0.92; }
          75% { transform: translate(-50%, -50%) translate(0px, 80px) rotate(270deg); opacity: 0.9; }
          81.25% { transform: translate(-50%, -50%) translate(30px, 70.7px) rotate(292.5deg); opacity: 0.92; }
          87.5% { transform: translate(-50%, -50%) translate(56.6px, 56.6px) rotate(315deg); opacity: 0.95; }
          93.75% { transform: translate(-50%, -50%) translate(70.7px, 30px) rotate(337.5deg); opacity: 0.92; }
          100% { transform: translate(-50%, -50%) translate(80px, 0px) rotate(360deg); opacity: 0.9; }
        }
        @keyframes float1 {
          0% { transform: translate(-50%, -50%) translate(35px, 0px) rotate(0deg); opacity: 1; }
          5% { transform: translate(-50%, -50%) translate(33.3px, 10.8px) rotate(-18deg); opacity: 1; }
          10% { transform: translate(-50%, -50%) translate(28.3px, 20.6px) rotate(-36deg); opacity: 1; }
          15% { transform: translate(-50%, -50%) translate(20.6px, 28.3px) rotate(-54deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) translate(10.8px, 33.3px) rotate(-72deg); opacity: 1; }
          25% { transform: translate(-50%, -50%) translate(0px, 35px) rotate(-90deg); opacity: 1; }
          30% { transform: translate(-50%, -50%) translate(-10.8px, 33.3px) rotate(-108deg); opacity: 1; }
          35% { transform: translate(-50%, -50%) translate(-20.6px, 28.3px) rotate(-126deg); opacity: 1; }
          40% { transform: translate(-50%, -50%) translate(-28.3px, 20.6px) rotate(-144deg); opacity: 1; }
          45% { transform: translate(-50%, -50%) translate(-33.3px, 10.8px) rotate(-162deg); opacity: 1; }
          50% { transform: translate(-50%, -50%) translate(-35px, 0px) rotate(-180deg); opacity: 1; }
          55% { transform: translate(-50%, -50%) translate(-33.3px, -10.8px) rotate(-198deg); opacity: 1; }
          60% { transform: translate(-50%, -50%) translate(-28.3px, -20.6px) rotate(-216deg); opacity: 1; }
          65% { transform: translate(-50%, -50%) translate(-20.6px, -28.3px) rotate(-234deg); opacity: 1; }
          70% { transform: translate(-50%, -50%) translate(-10.8px, -33.3px) rotate(-252deg); opacity: 1; }
          75% { transform: translate(-50%, -50%) translate(0px, -35px) rotate(-270deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) translate(10.8px, -33.3px) rotate(-288deg); opacity: 1; }
          85% { transform: translate(-50%, -50%) translate(20.6px, -28.3px) rotate(-306deg); opacity: 1; }
          90% { transform: translate(-50%, -50%) translate(28.3px, -20.6px) rotate(-324deg); opacity: 1; }
          95% { transform: translate(-50%, -50%) translate(33.3px, -10.8px) rotate(-342deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(35px, 0px) rotate(-360deg); opacity: 1; }
        }
        @keyframes float2 {
          0% { transform: translate(-50%, -50%) translate(50px, 0px) rotate(15deg); opacity: 1; }
          5% { transform: translate(-50%, -50%) translate(47.6px, -15.4px) rotate(33deg); opacity: 1; }
          10% { transform: translate(-50%, -50%) translate(40.5px, -29.4px) rotate(51deg); opacity: 1; }
          15% { transform: translate(-50%, -50%) translate(29.4px, -40.5px) rotate(69deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) translate(15.4px, -47.6px) rotate(87deg); opacity: 1; }
          25% { transform: translate(-50%, -50%) translate(0px, -50px) rotate(105deg); opacity: 1; }
          30% { transform: translate(-50%, -50%) translate(-15.4px, -47.6px) rotate(123deg); opacity: 1; }
          35% { transform: translate(-50%, -50%) translate(-29.4px, -40.5px) rotate(141deg); opacity: 1; }
          40% { transform: translate(-50%, -50%) translate(-40.5px, -29.4px) rotate(159deg); opacity: 1; }
          45% { transform: translate(-50%, -50%) translate(-47.6px, -15.4px) rotate(177deg); opacity: 1; }
          50% { transform: translate(-50%, -50%) translate(-50px, 0px) rotate(195deg); opacity: 1; }
          55% { transform: translate(-50%, -50%) translate(-47.6px, 15.4px) rotate(213deg); opacity: 1; }
          60% { transform: translate(-50%, -50%) translate(-40.5px, 29.4px) rotate(231deg); opacity: 1; }
          65% { transform: translate(-50%, -50%) translate(-29.4px, 40.5px) rotate(249deg); opacity: 1; }
          70% { transform: translate(-50%, -50%) translate(-15.4px, 47.6px) rotate(267deg); opacity: 1; }
          75% { transform: translate(-50%, -50%) translate(0px, 50px) rotate(285deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) translate(15.4px, 47.6px) rotate(303deg); opacity: 1; }
          85% { transform: translate(-50%, -50%) translate(29.4px, 40.5px) rotate(321deg); opacity: 1; }
          90% { transform: translate(-50%, -50%) translate(40.5px, 29.4px) rotate(339deg); opacity: 1; }
          95% { transform: translate(-50%, -50%) translate(47.6px, 15.4px) rotate(357deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(50px, 0px) rotate(375deg); opacity: 1; }
        }
        @keyframes float3 {
          0% { transform: translate(-50%, -50%) translate(45px, 0px) rotate(-20deg); opacity: 1; }
          5% { transform: translate(-50%, -50%) translate(42.8px, 13.9px) rotate(-38deg); opacity: 1; }
          10% { transform: translate(-50%, -50%) translate(36.4px, 26.5px) rotate(-56deg); opacity: 1; }
          15% { transform: translate(-50%, -50%) translate(26.5px, 36.4px) rotate(-74deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) translate(13.9px, 42.8px) rotate(-92deg); opacity: 1; }
          25% { transform: translate(-50%, -50%) translate(0px, 45px) rotate(-110deg); opacity: 1; }
          30% { transform: translate(-50%, -50%) translate(-13.9px, 42.8px) rotate(-128deg); opacity: 1; }
          35% { transform: translate(-50%, -50%) translate(-26.5px, 36.4px) rotate(-146deg); opacity: 1; }
          40% { transform: translate(-50%, -50%) translate(-36.4px, 26.5px) rotate(-164deg); opacity: 1; }
          45% { transform: translate(-50%, -50%) translate(-42.8px, 13.9px) rotate(-182deg); opacity: 1; }
          50% { transform: translate(-50%, -50%) translate(-45px, 0px) rotate(-200deg); opacity: 1; }
          55% { transform: translate(-50%, -50%) translate(-42.8px, -13.9px) rotate(-218deg); opacity: 1; }
          60% { transform: translate(-50%, -50%) translate(-36.4px, -26.5px) rotate(-236deg); opacity: 1; }
          65% { transform: translate(-50%, -50%) translate(-26.5px, -36.4px) rotate(-254deg); opacity: 1; }
          70% { transform: translate(-50%, -50%) translate(-13.9px, -42.8px) rotate(-272deg); opacity: 1; }
          75% { transform: translate(-50%, -50%) translate(0px, -45px) rotate(-290deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) translate(13.9px, -42.8px) rotate(-308deg); opacity: 1; }
          85% { transform: translate(-50%, -50%) translate(26.5px, -36.4px) rotate(-326deg); opacity: 1; }
          90% { transform: translate(-50%, -50%) translate(36.4px, -26.5px) rotate(-344deg); opacity: 1; }
          95% { transform: translate(-50%, -50%) translate(42.8px, -13.9px) rotate(-362deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(45px, 0px) rotate(-380deg); opacity: 1; }
        }
        @keyframes float4 {
          0% { transform: translate(-50%, -50%) translate(55px, 0px) rotate(30deg); opacity: 1; }
          5% { transform: translate(-50%, -50%) translate(52.4px, -16.9px) rotate(48deg); opacity: 1; }
          10% { transform: translate(-50%, -50%) translate(44.5px, -32.4px) rotate(66deg); opacity: 1; }
          15% { transform: translate(-50%, -50%) translate(32.4px, -44.5px) rotate(84deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) translate(16.9px, -52.4px) rotate(102deg); opacity: 1; }
          25% { transform: translate(-50%, -50%) translate(0px, -55px) rotate(120deg); opacity: 1; }
          30% { transform: translate(-50%, -50%) translate(-16.9px, -52.4px) rotate(138deg); opacity: 1; }
          35% { transform: translate(-50%, -50%) translate(-32.4px, -44.5px) rotate(156deg); opacity: 1; }
          40% { transform: translate(-50%, -50%) translate(-44.5px, -32.4px) rotate(174deg); opacity: 1; }
          45% { transform: translate(-50%, -50%) translate(-52.4px, -16.9px) rotate(192deg); opacity: 1; }
          50% { transform: translate(-50%, -50%) translate(-55px, 0px) rotate(210deg); opacity: 1; }
          55% { transform: translate(-50%, -50%) translate(-52.4px, 16.9px) rotate(228deg); opacity: 1; }
          60% { transform: translate(-50%, -50%) translate(-44.5px, 32.4px) rotate(246deg); opacity: 1; }
          65% { transform: translate(-50%, -50%) translate(-32.4px, 44.5px) rotate(264deg); opacity: 1; }
          70% { transform: translate(-50%, -50%) translate(-16.9px, 52.4px) rotate(282deg); opacity: 1; }
          75% { transform: translate(-50%, -50%) translate(0px, 55px) rotate(300deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) translate(16.9px, 52.4px) rotate(318deg); opacity: 1; }
          85% { transform: translate(-50%, -50%) translate(32.4px, 44.5px) rotate(336deg); opacity: 1; }
          90% { transform: translate(-50%, -50%) translate(44.5px, 32.4px) rotate(354deg); opacity: 1; }
          95% { transform: translate(-50%, -50%) translate(52.4px, 16.9px) rotate(372deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(55px, 0px) rotate(390deg); opacity: 1; }
        }
        @keyframes float5 {
          0% { transform: translate(-50%, -50%) translate(42px, 0px) rotate(-25deg); opacity: 1; }
          5% { transform: translate(-50%, -50%) translate(40.0px, 12.9px) rotate(-43deg); opacity: 1; }
          10% { transform: translate(-50%, -50%) translate(34.0px, 24.7px) rotate(-61deg); opacity: 1; }
          15% { transform: translate(-50%, -50%) translate(24.7px, 34.0px) rotate(-79deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) translate(12.9px, 40.0px) rotate(-97deg); opacity: 1; }
          25% { transform: translate(-50%, -50%) translate(0px, 42px) rotate(-115deg); opacity: 1; }
          30% { transform: translate(-50%, -50%) translate(-12.9px, 40.0px) rotate(-133deg); opacity: 1; }
          35% { transform: translate(-50%, -50%) translate(-24.7px, 34.0px) rotate(-151deg); opacity: 1; }
          40% { transform: translate(-50%, -50%) translate(-34.0px, 24.7px) rotate(-169deg); opacity: 1; }
          45% { transform: translate(-50%, -50%) translate(-40.0px, 12.9px) rotate(-187deg); opacity: 1; }
          50% { transform: translate(-50%, -50%) translate(-42px, 0px) rotate(-205deg); opacity: 1; }
          55% { transform: translate(-50%, -50%) translate(-40.0px, -12.9px) rotate(-223deg); opacity: 1; }
          60% { transform: translate(-50%, -50%) translate(-34.0px, -24.7px) rotate(-241deg); opacity: 1; }
          65% { transform: translate(-50%, -50%) translate(-24.7px, -34.0px) rotate(-259deg); opacity: 1; }
          70% { transform: translate(-50%, -50%) translate(-12.9px, -40.0px) rotate(-277deg); opacity: 1; }
          75% { transform: translate(-50%, -50%) translate(0px, -42px) rotate(-295deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) translate(12.9px, -40.0px) rotate(-313deg); opacity: 1; }
          85% { transform: translate(-50%, -50%) translate(24.7px, -34.0px) rotate(-331deg); opacity: 1; }
          90% { transform: translate(-50%, -50%) translate(34.0px, -24.7px) rotate(-349deg); opacity: 1; }
          95% { transform: translate(-50%, -50%) translate(40.0px, -12.9px) rotate(-367deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(42px, 0px) rotate(-385deg); opacity: 1; }
        }
        @keyframes float6 {
          0% { transform: translate(-50%, -50%) translate(48px, 0px) rotate(10deg); opacity: 1; }
          5% { transform: translate(-50%, -50%) translate(45.7px, -14.8px) rotate(28deg); opacity: 1; }
          10% { transform: translate(-50%, -50%) translate(38.8px, -28.2px) rotate(46deg); opacity: 1; }
          15% { transform: translate(-50%, -50%) translate(28.2px, -38.8px) rotate(64deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) translate(14.8px, -45.7px) rotate(82deg); opacity: 1; }
          25% { transform: translate(-50%, -50%) translate(0px, -48px) rotate(100deg); opacity: 1; }
          30% { transform: translate(-50%, -50%) translate(-14.8px, -45.7px) rotate(118deg); opacity: 1; }
          35% { transform: translate(-50%, -50%) translate(-28.2px, -38.8px) rotate(136deg); opacity: 1; }
          40% { transform: translate(-50%, -50%) translate(-38.8px, -28.2px) rotate(154deg); opacity: 1; }
          45% { transform: translate(-50%, -50%) translate(-45.7px, -14.8px) rotate(172deg); opacity: 1; }
          50% { transform: translate(-50%, -50%) translate(-48px, 0px) rotate(190deg); opacity: 1; }
          55% { transform: translate(-50%, -50%) translate(-45.7px, 14.8px) rotate(208deg); opacity: 1; }
          60% { transform: translate(-50%, -50%) translate(-38.8px, 28.2px) rotate(226deg); opacity: 1; }
          65% { transform: translate(-50%, -50%) translate(-28.2px, 38.8px) rotate(244deg); opacity: 1; }
          70% { transform: translate(-50%, -50%) translate(-14.8px, 45.7px) rotate(262deg); opacity: 1; }
          75% { transform: translate(-50%, -50%) translate(0px, 48px) rotate(280deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) translate(14.8px, 45.7px) rotate(298deg); opacity: 1; }
          85% { transform: translate(-50%, -50%) translate(28.2px, 38.8px) rotate(316deg); opacity: 1; }
          90% { transform: translate(-50%, -50%) translate(38.8px, 28.2px) rotate(334deg); opacity: 1; }
          95% { transform: translate(-50%, -50%) translate(45.7px, 14.8px) rotate(352deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(48px, 0px) rotate(370deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
