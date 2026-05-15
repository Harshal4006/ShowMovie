import marvelStudios from "../../assets/studios/marvel-studios.svg";
import warnerBros from "../../assets/studios/warner-bros.svg";
import disney from "../../assets/studios/disney.svg";
import universal from "../../assets/studios/universal.svg";
import paramount from "../../assets/studios/paramount.svg";
import dc from "../../assets/studios/dc.svg";
import hboMax from "../../assets/studios/hbomax.svg";
import imax from "../../assets/studios/imax.svg";
import netflix from "../../assets/studios/netflix.svg";
import prime from "../../assets/studios/pirme.svg";
import "./StudioStrip.css";

const studios = [
  { name: "Marvel Studios", logo: marvelStudios },
  { name: "Warner Bros.", logo: warnerBros },
  { name: "DC", logo: dc },
  { name: "Disney", logo: disney },
  { name: "HBO Max", logo: hboMax },
  { name: "IMAX", logo: imax },
  { name: "Netflix", logo: netflix },
  { name: "Prime Video", logo: prime },
  { name: "Universal", logo: universal },
  { name: "Paramount", logo: paramount },
];

const repeatedStudios = [...studios, ...studios];

const StudioStrip = ({ variant = "page" }) => {
  const shellClassName =
    variant === "card"
      ? "studio-strip-mask studio-strip-mask--card relative overflow-hidden py-4"
      : "studio-strip-mask relative overflow-hidden py-4";

  return (
    <div className={shellClassName}>
      <div className="animate-studio-marquee motion-reduce:animate-none flex w-max items-center gap-10 sm:gap-16 lg:gap-20">
        {repeatedStudios.map((studio, index) => (
          <div
            key={`${studio.name}-${index}`}
            className="inline-flex items-center justify-center whitespace-nowrap opacity-55 transition-opacity duration-300 hover:opacity-85"
          >
            <img
              src={studio.logo}
              alt={studio.name}
              loading="lazy"
              className="block h-7 w-auto max-w-32 grayscale sm:h-8 md:h-9"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudioStrip;
