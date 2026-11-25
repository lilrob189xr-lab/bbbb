import Image from "next/image";
import type { Photo as PhotoData } from "@/data/photos";

/** Real photograph in a hairline frame. Aspect ratio is fixed by the caller; object-fit keeps proportions.
 *  `caption` renders below the frame; `tag` renders as a small ivory label on the photo. */
export default function Photo({
  photo, ratio, sizes, priority = false, focus = "center", caption, tag, className = "",
}: { photo: PhotoData; ratio: string; sizes: string; priority?: boolean; focus?: string; caption?: string; tag?: string; className?: string }) {
  return (
    <figure className={`photo ${className}`.trim()}>
      <div className="photo__frame" style={{ aspectRatio: ratio }}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover", objectPosition: focus }} />
        {tag && <span className="photo__cap">{tag}</span>}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
