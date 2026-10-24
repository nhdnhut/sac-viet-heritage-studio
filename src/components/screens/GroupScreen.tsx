"use client";

import React, { useState } from "react";
import { Users, Sparkles, Plus, Shirt, CheckCircle2 } from "lucide-react";
import { OutfitSpec } from "@/types";
import { Mockup2D } from "@/components/Mockup2D";

interface GroupMember {
  id: string;
  name: string;
  role: string;
  garmentId: "ao_ngu_than_tay_chen" | "ao_dai_hien_dai";
  primaryColor: string;
  pantsColor: string;
}

export function GroupScreen({ onOpenInStudio }: { onOpenInStudio: (spec: OutfitSpec) => void }) {
  const [theme, setTheme] = useState("Kỷ Yếu Di Sản & Thanh Xuân Học Đường");
  const [members, setMembers] = useState<GroupMember[]>([
    {
      id: "mem_1",
      name: "Nguyễn Văn An",
      role: "Trưởng nhóm / Đại diện phong thái đĩnh đạc",
      garmentId: "ao_ngu_than_tay_chen",
      primaryColor: "#1D3557",
      pantsColor: "#FFFDF7",
    },
    {
      id: "mem_2",
      name: "Trần Mai Chi",
      role: "Thành viên / Nét duyên dáng thanh nhã",
      garmentId: "ao_dai_hien_dai",
      primaryColor: "#9E2A2B",
      pantsColor: "#FFFDF7",
    },
    {
      id: "mem_3",
      name: "Lê Minh Đức",
      role: "Thành viên / Năng động học đường remix",
      garmentId: "ao_ngu_than_tay_chen",
      primaryColor: "#D4AF37",
      pantsColor: "#FFFDF7",
    },
  ]);

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Thành viên");
  const [newMemberGarment, setNewMemberGarment] = useState<"ao_ngu_than_tay_chen" | "ao_dai_hien_dai">("ao_ngu_than_tay_chen");
  const [newMemberColor, setNewMemberColor] = useState("#1B4931");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    setMembers([
      ...members,
      {
        id: `mem_${Date.now()}`,
        name: newMemberName.trim(),
        role: newMemberRole.trim() || "Thành viên",
        garmentId: newMemberGarment,
        primaryColor: newMemberColor,
        pantsColor: "#FFFDF7",
      },
    ]);
    setNewMemberName("");
  };

  const handleCreateStudioSpec = (member: GroupMember) => {
    const now = new Date().toISOString();
    const spec: OutfitSpec = {
      id: `group_spec_${member.id}`,
      name: `${member.name} — ${theme}`,
      garmentId: member.garmentId,
      garmentName:
        member.garmentId === "ao_ngu_than_tay_chen" ? "Áo ngũ thân tay chẽn" : "Áo dài hiện đại",
      collarId: "co_dung_truyen_thong",
      collarName: "Cổ đứng lập lĩnh",
      sleeveId: "tay_chen_chuan",
      sleeveName: "Tay chẽn chuẩn mực",
      buttonId: "cuc_ngoc_5_chiec",
      buttonName: "5 Cúc đồng / Ngọc",
      pantsId: "quan_trang_ong_rong",
      pantsName: "Quần trắng ống đứng",
      primaryColor: member.primaryColor,
      secondaryColor: "#D4AF37",
      pantsColor: member.pantsColor,
      fabricId: "lua_to_tam_ha_dong",
      fabricName: "Lụa tơ tằm Vạn Phúc",
      accessories: ["quat_giay_do_thu_phap"],
      remixStory: {
        keep: ["Quy thức nẹp khuy cài phải", "Cấu trúc 5 thân đĩnh đạc"],
        remix: ["Bảng màu hòa sắc đồng điệu cho kỷ yếu tập thể"],
        culturalMeaning: "Sự đoàn kết và kế thừa văn hóa của một tập thể học đường.",
        aestheticReasoning: "Phối màu tương phản bổ trợ (Chàm - Đỏ son - Hoàng kim) tạo tổng thể ảnh nhóm rực rỡ và hài hòa.",
      },
      lockedFeatures: {},
      specHash: `hash_${member.id}`,
      revision: 1,
      createdAt: now,
      updatedAt: now,
    };
    onOpenInStudio(spec);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-xs">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-imperial-400" />
          <h2 className="text-xl font-serif font-black text-parchment-100">
            Phối Đồ Nhóm & Câu Lạc Bộ (Group Harmony)
          </h2>
        </div>
        <p className="text-parchment-400 mt-1">
          Thiết lập chủ đề đồng điệu cho tập thể: bảng màu hòa sắc chung, đặc tả y phục riêng cho từng thành viên.
        </p>
      </div>

      {/* Theme Card */}
      <div className="bg-silkDark-850 border border-lacquer-800/40 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-parchment-400 block text-[10px] uppercase font-bold tracking-wider">
              Chủ Đề Nhóm Hiện Tại:
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-transparent font-serif font-black text-base text-parchment-100 border-b border-imperial-500/50 focus:outline-none focus:border-imperial-400 py-1 w-full max-w-md"
            />
          </div>

          {/* Group Palette Preview */}
          <div className="flex items-center gap-2 bg-silkDark-900 px-3 py-2 rounded-xl border border-white/5">
            <span className="text-[11px] text-parchment-400">Bảng màu nhóm:</span>
            <div className="flex items-center -space-x-1.5">
              {members.map((m) => (
                <span
                  key={m.id}
                  className="w-5 h-5 rounded-full border-2 border-silkDark-850 shadow"
                  style={{ backgroundColor: m.primaryColor }}
                  title={`${m.name}: ${m.primaryColor}`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-parchment-400 leading-relaxed border-t border-white/5 pt-2">
          * Lưu ý chuyên môn: Mỗi thành viên có thể xuất ảnh cá nhân riêng để đảm bảo giữ nguyên danh tính khuôn mặt và độ sắc nét chi tiết y phục.
        </p>
      </div>

      {/* Add Member Form */}
      <form
        onSubmit={handleAddMember}
        className="bg-silkDark-900 border border-white/5 rounded-2xl p-4 flex flex-wrap items-center gap-3"
      >
        <div className="flex-1 min-w-[160px]">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Tên thành viên mới..."
            required
            className="w-full bg-silkDark-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-parchment-100 focus:outline-none focus:ring-1 focus:ring-imperial-500"
          />
        </div>

        <div className="min-w-[140px]">
          <select
            value={newMemberGarment}
            onChange={(e) => setNewMemberGarment(e.target.value as any)}
            className="w-full bg-silkDark-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-parchment-100 focus:outline-none focus:ring-1 focus:ring-imperial-500"
          >
            <option value="ao_ngu_than_tay_chen">Áo ngũ thân tay chẽn</option>
            <option value="ao_dai_hien_dai">Áo dài hiện đại</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-silkDark-850 px-3 py-1.5 rounded-xl border border-white/10">
          <input
            type="color"
            value={newMemberColor}
            onChange={(e) => setNewMemberColor(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
          />
          <span className="font-mono text-[11px] text-parchment-300">{newMemberColor}</span>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-imperial-600 hover:bg-imperial-500 text-silkDark-950 font-bold rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Thành Viên</span>
        </button>
      </form>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-silkDark-850 border border-lacquer-800/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-imperial-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className="w-5 h-5 rounded-full border border-white/20 shadow"
                  style={{ backgroundColor: member.primaryColor }}
                />
                <span className="text-[10px] text-parchment-400 uppercase tracking-wider font-semibold">
                  {member.garmentId === "ao_ngu_than_tay_chen" ? "Ngũ Thân" : "Áo Dài"}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-parchment-100 text-sm">{member.name}</h3>
                <p className="text-[11px] text-imperial-400">{member.role}</p>
              </div>

              <div className="bg-silkDark-900/60 p-2.5 rounded-xl border border-white/5 text-[11px] text-parchment-300 space-y-1">
                <div>Màu thân áo: <strong style={{ color: member.primaryColor }}>{member.primaryColor}</strong></div>
                <div>Quần lụa: Trắng ngà ({member.pantsColor})</div>
              </div>
            </div>

            <button
              onClick={() => handleCreateStudioSpec(member)}
              className="w-full py-2 bg-lacquer-800 hover:bg-lacquer-700 text-parchment-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-imperial-400" />
              <span>Phối Chi Tiết Trong Studio</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
