import { Star, BadgeCheck } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
  verified: boolean;
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-[#fbf9f5] rounded-2xl p-6 border border-[#e4e2de] shadow-artisan flex flex-col gap-4">
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < testimonial.rating ? "fill-[#f4a460] text-[#f4a460]" : "fill-[#e4e2de] text-[#e4e2de]"}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm text-[#534439] leading-relaxed flex-1">"{testimonial.text}"</p>

      {/* Product tag */}
      <span className="text-xs text-[#8d4f11] bg-[#f4a460]/15 px-2.5 py-1 rounded-full w-fit font-medium">
        {testimonial.product}
      </span>

      {/* Author */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#efeeea]">
        <div className="w-8 h-8 rounded-full bg-[#efeeea] flex items-center justify-center text-sm font-bold text-[#8d4f11]">
          {testimonial.name[0]}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-[#1b1c1a]">{testimonial.name}</span>
            {testimonial.verified && (
              <BadgeCheck size={13} className="fill-[#006d3d] text-white" />
            )}
          </div>
          <p className="text-xs text-[#857467]">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
}
