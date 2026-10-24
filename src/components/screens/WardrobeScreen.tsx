"use client";

import React, { useState, useEffect } from "react";
import { WardrobeItem } from "@/types";
import { Shirt, Plus, Trash2, Tag, Check, Sparkles } from "lucide-react";

export function WardrobeScreen() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<WardrobeItem["type"]>("garment");
  const [colorHex, setColorHex] = useState("#800E13");
  const [fabric, setFabric] = useState("Lụa tơ tằm");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    try {
      const res = await fetch("/api/wardrobe");
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          colorHex,
          fabric: fabric.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.item) {
        setItems([data.item, ...items]);
        setName("");
        setNotes("");
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-imperial-400" />
            <h2 className="text-xl font-serif font-black text-parchment-100">
              Tủ Đồ Việt Phục Cá Nhân
            </h2>
          </div>
          <p className="text-parchment-400 mt-1">
            Khai báo các trang phục, quần lụa và phụ kiện bạn đã có sẵn để Studio ưu tiên phối ghép và gợi ý món cần bổ sung ({items.length} món)
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-imperial-600 hover:bg-imperial-500 text-silkDark-950 font-bold rounded-xl flex items-center gap-1.5 shadow active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Món Đồ Mới</span>
        </button>
      </div>

      {/* Add Item Modal/Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddItem}
          className="bg-silkDark-850 border border-imperial-500/40 rounded-2xl p-5 shadow-2xl space-y-3 max-w-lg mx-auto"
        >
          <h3 className="font-serif font-bold text-sm text-parchment-100 border-b border-white/10 pb-2">
            Thêm Trang Phục Vào Tủ Đồ
          </h3>

          <div>
            <label className="font-semibold text-parchment-300 block mb-1">Tên món đồ:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Áo ngũ thân lụa Vạn Phúc đỏ son, Quần lụa trắng, Khăn đóng nhung đen..."
              required
              className="w-full bg-silkDark-900 border border-white/10 rounded-xl p-2.5 text-parchment-100 focus:outline-none focus:ring-1 focus:ring-imperial-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-parchment-300 block mb-1">Loại món đồ:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-silkDark-900 border border-white/10 rounded-xl p-2.5 text-parchment-100 focus:ring-1 focus:ring-imperial-500"
              >
                <option value="garment">Y phục chính (Áo)</option>
                <option value="pants">Quần (Quần lụa / Quần tây)</option>
                <option value="accessory">Phụ kiện (Khăn, quạt, túi)</option>
                <option value="footwear">Giày dép (Guốc mộc, sneaker)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-parchment-300 block mb-1">Màu sắc chính:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-parchment-300">{colorHex}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-parchment-300 block mb-1">Chất liệu vải:</label>
            <input
              type="text"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              placeholder="Ví dụ: Gấm hoa, Lụa tơ tằm, Đũi..."
              className="w-full bg-silkDark-900 border border-white/10 rounded-xl p-2.5 text-parchment-100 focus:outline-none focus:ring-1 focus:ring-imperial-500"
            />
          </div>

          <div>
            <label className="font-semibold text-parchment-300 block mb-1">Ghi chú thêm:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Độ mới, kích cỡ hoặc lưu ý đặc biệt..."
              className="w-full bg-silkDark-900 border border-white/10 rounded-xl p-2.5 text-parchment-100 focus:outline-none focus:ring-1 focus:ring-imperial-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-silkDark-800 text-parchment-300 hover:text-white rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-imperial-600 hover:bg-imperial-500 text-silkDark-950 font-bold rounded-lg shadow"
            >
              Lưu Vào Tủ
            </button>
          </div>
        </form>
      )}

      {/* Wardrobe Items Grid */}
      {items.length === 0 ? (
        <div className="p-12 text-center bg-silkDark-900 border border-white/5 rounded-2xl space-y-3">
          <Shirt className="w-10 h-10 text-imperial-400 mx-auto" />
          <h4 className="text-base font-serif font-bold text-parchment-100">
            Tủ đồ của bạn hiện đang trống
          </h4>
          <p className="text-parchment-400 max-w-sm mx-auto">
            Nhấn &ldquo;Thêm Món Đồ Mới&rdquo; để đăng ký các món trang phục truyền thống mà bạn đang có sẵn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-silkDark-850 border border-white/5 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3 hover:border-imperial-500/30 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-imperial-400 uppercase font-bold tracking-wider">
                    {item.type}
                  </span>
                  {item.colorHex && (
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: item.colorHex }}
                      title={item.colorHex}
                    />
                  )}
                </div>

                <h4 className="font-serif font-bold text-parchment-100 text-sm">{item.name}</h4>
                {item.fabric && (
                  <div className="text-[11px] text-parchment-400">Chất liệu: {item.fabric}</div>
                )}
                {item.notes && (
                  <p className="text-[11px] text-parchment-300 italic">{item.notes}</p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-[10px] text-parchment-400">Sẵn sàng phối</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Xóa khỏi tủ"
                  className="p-1 hover:bg-red-950 text-parchment-400 hover:text-red-400 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
