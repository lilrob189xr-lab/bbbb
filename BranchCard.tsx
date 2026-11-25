import Link from "next/link";
import type { Branch } from "@/data/branches";
import { photosOf, type Photo as PhotoData } from "@/data/photos";
import OpenStatus from "@/components/i18n/OpenStatus";
import Photo from "@/components/ui/Photo";

export default function BranchCard({ branch, cover, detailLink = true }: { branch: Branch; cover?: PhotoData; detailLink?: boolean }) {
  const photo = cover ?? photosOf(branch.id)[0];
  return (
    <article className="bcard">
      <div className="bcard__media">
        {photo ? (
          <Photo photo={photo} ratio="4 / 3" sizes="(min-width:1024px) 45vw, 100vw" />
        ) : (
          <div className="photo__frame placeholder placeholder--green" style={{ aspectRatio: "4 / 3" }} />
        )}
      </div>
      <div className="bcard__body">
        <p className="label gold">สาขา {branch.number}</p>
        <h3>{branch.brandName}</h3>
        <p className="bcard__name">{branch.nameTh}</p>
        <dl className="facts">
          <dt>เวลาเปิดทำการ</dt><dd>{branch.hours}<OpenStatus openMin={branch.openMin} closeMin={branch.closeMin} /></dd>
          <dt>โทรศัพท์</dt><dd><a href={branch.phoneHref}>{branch.phoneDisplay}</a></dd>
        </dl>
        <div className="inquiry">
          <a className="btn btn--primary" href={branch.phoneHref}>โทร {branch.phoneDisplay}</a>
          <a className="btn btn--secondary" href={branch.mapsUrl} target="_blank" rel="noopener noreferrer">เปิดแผนที่</a>
          {detailLink && <Link className="link-gold bcard__more" href={`/locations#${branch.id}`}>ดูรายละเอียดสาขา</Link>}
        </div>
      </div>
    </article>
  );
}
