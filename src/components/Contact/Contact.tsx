"use client";
import { slideIn } from "@/utils/motion";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SectionWrapper } from "@/components/HigherOrderComponents";
import { EarthCanvas } from "@/components/canvas";
import { useLanguage } from "@/context/LanguageContext";

const Contact = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const { t } = useLanguage();

	const [form, setForm] = useState({
		name: "",
		message: "",
	});

	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState<{
		show: boolean;
		type: "success" | "error";
		message: string;
	}>({
		show: false,
		type: "success",
		message: "",
	});

	useEffect(() => {
		if (notification.show) {
			const timer = setTimeout(() => {
				setNotification((prev) => ({ ...prev, show: false }));
			}, 4000);
			return () => clearTimeout(timer);
		}
	}, [notification.show]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!form.message.trim()) {
			setNotification({
				show: true,
				type: "error",
				message: t("contact.messagePlaceholder") || "Please write your message.",
			});
			return;
		}
		setLoading(true);
		try {
			const payload = {
				name: form.name,
				message: form.message,
				clientInfo: {
					screenResolution: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "Unknown",
					submitTime: new Date().toLocaleString(),
					currentPage: typeof window !== "undefined" ? window.location.href : "Unknown",
				}
			};

			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (response.ok) {
				setLoading(false);
				setNotification({
					show: true,
					type: "success",
					message: t("contact.successMsg") || "Message sent successfully!",
				});
				setForm({
					name: "",
					message: "",
				});
			} else {
				setLoading(false);
				setNotification({
					show: true,
					type: "error",
					message: data.error || t("contact.errorMsg") || "Failed to send message.",
				});
			}
		} catch (error) {
			setLoading(false);
			setNotification({
				show: true,
				type: "error",
				message: t("contact.errorMsg") || "Something went wrong.",
			});
		}
	};

	return (
		<div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden relative">
			<motion.div
				variants={slideIn("left", "tween", 0.2, 1)}
				className="flex-[0.75] bg-black-100/45 backdrop-blur-xl border border-white/10 p-8 rounded-2xl"
			>
				<p className="heroSubText">{t("contact.getInTouch")}</p>
				<h3 className="heroHeadText">{t("contact.title")}</h3>
				<form
					ref={formRef}
					onSubmit={handleSubmit}
					className="mt-12 flex flex-col gap-8"
				>
					<label className="flex flex-col">
						<div className="flex justify-between items-center mb-4 flex-wrap gap-2">
							<span className="text-white font-medium">{t("contact.yourName")}</span>
							<span className="text-xs text-white/50 font-normal">({t("contact.anonymousText") || "Optional - send anonymously"})</span>
						</div>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder={t("contact.namePlaceholder")}
							className="bg-tertiary/40 backdrop-blur-sm border border-white/5 py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none focus:border-white/20 transition-all font-medium"
						/>
					</label>
					<label className="flex flex-col">
						<span className="text-white font-medium mb-4">{t("contact.yourMessage")}</span>
						<textarea
							rows={7}
							name="message"
							value={form.message}
							onChange={handleChange}
							placeholder={t("contact.messagePlaceholder")}
							className="bg-tertiary/40 backdrop-blur-sm border border-white/5 py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none focus:border-white/20 transition-all font-medium"
						/>
					</label>
					<button
						type="submit"
						className="bg-[var(--accent)] hover:bg-[var(--accent-secondary)] py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
					>
						{loading ? t("contact.sending") : t("contact.send")}
					</button>
				</form>
			</motion.div>
			<motion.div
				variants={slideIn("right", "tween", 0.2, 1)}
				className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
			>
				<EarthCanvas />
			</motion.div>

			{/* Custom Glassmorphism Toast Notification */}
			<AnimatePresence>
				{notification.show && (
					<motion.div
						initial={{ opacity: 0, y: 50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.9 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-4 py-4 px-6 rounded-2xl border backdrop-blur-md shadow-2xl ${
							notification.type === "success"
								? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
								: "bg-rose-500/10 border-rose-500/20 text-rose-400"
						}`}
						style={{
							boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
						}}
					>
						<span className="text-2xl flex items-center justify-center">
							{notification.type === "success" ? "✨" : "⚠️"}
						</span>
						<div className="flex flex-col gap-0.5 max-w-[280px]">
							<span className="font-bold text-xs uppercase tracking-wider text-white">
								{notification.type === "success" ? "Success" : "Error"}
							</span>
							<span className="text-sm text-white/80 font-normal leading-relaxed">
								{notification.message}
							</span>
						</div>
						<button
							onClick={() => setNotification({ ...notification, show: false })}
							className="ml-2 text-white/30 hover:text-white/80 transition-colors focus:outline-none text-sm p-1"
						>
							✕
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default SectionWrapper(Contact, "contact");
