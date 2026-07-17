"use client";
import { slideIn } from "@/utils/motion";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { SectionWrapper } from "@/components/HigherOrderComponents";
import { EarthCanvas } from "@/components/canvas";
import { useLanguage } from "@/context/LanguageContext";

const Contact = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const { t } = useLanguage();

	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		emailjs
			.send(
				"service_91ssn8g",
				"template_jjegxdr",
				{
					from_name: form.name,
					to_name: "Om Patel",
					from_email: form.email,
					to_email: "omunite21@gmail.com",
					message: form.message,
				},
				"VeFeVdEHL9F9_i6xp",
			)
			.then(() => {
				setLoading(false);
				alert(t("contact.successMsg"));
				setForm({
					name: "",
					email: "",
					message: "",
				});
			})
			.catch((error) => {
				setLoading(false);
				alert(t("contact.errorMsg"));
			});
	};

	return (
		<div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
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
						<span className="text-white font-medium mb-4">{t("contact.yourName")}</span>
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
						<span className="text-white font-medium mb-4">{t("contact.yourEmail")}</span>
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							placeholder={t("contact.emailPlaceholder")}
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
		</div>
	);
};

export default SectionWrapper(Contact, "contact");
