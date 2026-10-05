"use client";

import { useState } from "react";
import { BatteryMedium, MessageCircle, Phone, ShieldCheck, Store } from "lucide-react";
import { CONDITION_LABEL, capacityLabel, formatVND } from "@/lib/format";
import type { ShopUnit } from "@/lib/shop";

type Contact = { phone: string | null; phoneHref: string | null; zaloHref: string | null };

const uniq = <T,>(xs: T[]) => [...new Set(xs)];
const capOf = (u: ShopUnit) => capacityLabel(u) ?? "";
const colorOf = (u: ShopUnit) => u.variant ?? "";

function minPrice(units: ShopUnit[], key: (u: ShopUnit) => string, value: string) {
  return Math.min(...units.filter((u) => key(u) === value).map((u) => u.price));
}

/**
 * Chọn cấu hình kiểu trang mua iPhone: Tình trạng → Dung lượng → Màu → (máy cũ) chọn đúng máy theo % pin.
 * Đổi lựa chọn phía trên mà lựa chọn phía dưới không còn hàng thì tự chuyển sang lựa chọn đầu tiên còn hàng.
 */
export function ProductConfigurator({
  name,
  units,
  isPhone,
  contact,
}: {
  name: string;
  units: ShopUnit[];
  isPhone: boolean;
  contact: Contact;
}) {
  const [cond, setCond] = useState<string>();
  const [cap, setCap] = useState<string>();
  const [color, setColor] = useState<string>();
  const [unitId, setUnitId] = useState<number>();

  const conds = uniq(units.map((u) => u.condition)).sort(); // NEW trước USED
  const condSel = cond && conds.includes(cond) ? cond : conds[0];
  const byCond = units.filter((u) => u.condition === condSel);

  const caps = uniq(byCond.map(capOf)).sort((a, b) => minPrice(byCond, capOf, a) - minPrice(byCond, capOf, b));
  const capSel = cap !== undefined && caps.includes(cap) ? cap : caps[0];
  const byCap = byCond.filter((u) => capOf(u) === capSel);

  const colors = uniq(byCap.map(colorOf));
  const colorSel = color !== undefined && colors.includes(color) ? color : colors[0];
  const matches = byCap.filter((u) => colorOf(u) === colorSel).sort((a, b) => a.price - b.price);
  const unit = matches.find((u) => u.id === unitId) ?? matches[0];

  const label = [name, capSel, colorSel, condSel === "USED" ? "(Cũ)" : null].filter(Boolean).join(" ");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className={`text-3xl font-semibold tracking-tight tabular-nums ${unit.price < unit.listPrice ? "text-[#e30000]" : ""}`}>
          {formatVND(unit.price)}
        </p>
        {unit.price < unit.listPrice && (
          <p className="text-[17px] text-[#6e6e73] tabular-nums line-through">{formatVND(unit.listPrice)}</p>
        )}
      </div>

      {conds.length > 1 && (
        <Group title="Tình trạng.">
          {conds.map((c) => (
            <Option
              key={c}
              selected={c === condSel}
              onClick={() => setCond(c)}
              title={CONDITION_LABEL[c] ?? c}
              sub={`Từ ${formatVND(minPrice(units, (u) => u.condition, c))}`}
            />
          ))}
        </Group>
      )}

      {caps.length > 1 && (
        <Group title={isPhone ? "Dung lượng." : "Phiên bản."}>
          {caps.map((c) => (
            <Option
              key={c}
              selected={c === capSel}
              onClick={() => setCap(c)}
              title={c || "Tiêu chuẩn"}
              sub={`Từ ${formatVND(minPrice(byCond, capOf, c))}`}
            />
          ))}
        </Group>
      )}

      {colors.length > 1 && (
        <Group title={isPhone ? "Màu sắc." : "Loại."}>
          {colors.map((c) => (
            <Option key={c} selected={c === colorSel} onClick={() => setColor(c)} title={c || "Tiêu chuẩn"} />
          ))}
        </Group>
      )}

      {/* Máy cũ: mỗi máy một tình trạng pin khác nhau → cho chọn đúng máy */}
      {matches.length > 1 && condSel === "USED" && isPhone && (
        <Group title={`Chọn máy. ${matches.length} máy đang có.`}>
          {matches.map((u, i) => (
            <Option
              key={u.id}
              selected={u.id === unit.id}
              onClick={() => setUnitId(u.id)}
              title={u.batteryHealth ? `Pin ${u.batteryHealth}%` : `Máy ${i + 1}`}
              sub={formatVND(u.price)}
            />
          ))}
        </Group>
      )}

      <ul className="space-y-3 rounded-2xl bg-[#f5f5f7] p-5 text-[15px]">
        <li className="flex items-center gap-3">
          <ShieldCheck size={20} className="shrink-0" aria-hidden />
          {unit.warrantyMonths > 0 ? `Bảo hành ${unit.warrantyMonths} tháng tại cửa hàng` : "Không kèm bảo hành"}
        </li>
        {isPhone && (
          <li className="flex items-center gap-3">
            <Store size={20} className="shrink-0" aria-hidden />
            {CONDITION_LABEL[unit.condition] ?? unit.condition}
            {matches.length > 1 && condSel !== "USED" && ` · còn ${matches.length} máy`}
          </li>
        )}
        {unit.batteryHealth != null && (
          <li className="flex items-center gap-3">
            <BatteryMedium size={20} className="shrink-0" aria-hidden />
            Tình trạng pin {unit.batteryHealth}%
          </li>
        )}
      </ul>

      <div className="space-y-3">
        <p className="text-[15px]">
          <span className="text-[#6e6e73]">Bạn chọn: </span>
          <b>{label}</b>
          <span className="text-[#6e6e73]"> · Mã SP #{unit.id}</span>
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {contact.zaloHref && (
            <a href={contact.zaloHref} target="_blank" rel="noopener noreferrer" className="btn-blue h-12 flex-1">
              <MessageCircle size={18} aria-hidden />
              Nhắn Zalo tư vấn
            </a>
          )}
          {contact.phoneHref && (
            <a href={contact.phoneHref} className="btn h-12 flex-1">
              <Phone size={18} aria-hidden />
              Gọi {contact.phone}
            </a>
          )}
        </div>
        <p className="text-[14px] text-[#6e6e73]">
          {contact.zaloHref || contact.phoneHref
            ? `Liên hệ và báo mã SP #${unit.id} để được tư vấn nhanh.`
            : `Ghé cửa hàng và báo mã SP #${unit.id} để xem máy.`}
        </p>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[17px] font-semibold tracking-tight">{title}</legend>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </fieldset>
  );
}

function Option({
  selected,
  onClick,
  title,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-xl border-2 px-4 py-3.5 text-left transition ${
        selected ? "border-[#0071e3]" : "border-[#d2d2d7] hover:border-[#86868b]"
      }`}
    >
      <span className="block text-[15px] font-semibold">{title}</span>
      {sub && <span className="mt-0.5 block text-[14px] text-[#6e6e73] tabular-nums">{sub}</span>}
    </button>
  );
}
