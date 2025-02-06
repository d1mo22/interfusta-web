import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Text,
	Section,
} from "@react-email/components";

interface EmailTemplateProps {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;
}

export const ContactNotification = ({
	firstName,
	lastName,
	email,
	phone,
	message,
}: EmailTemplateProps) => {
	return (
		<Html>
			<Head />
			<Preview>
				Nova consulta rebuda de {firstName} {lastName}
			</Preview>
			<Body style={main}>
				<Container style={container}>
					{/* Text version for email clients that don't support HTML */}
					<div style={{ display: "none" }}>
						Nova Consulta Rebuda Informació del Client: Nom complet: {firstName}{" "}
						{lastName}
						Email: {email}
						Telèfon: {phone}
						Missatge:
						{message}
						Aquest missatge ha estat enviat des del formulari de contacte de
						interfustaandorra.com
					</div>

					<Heading style={h1}>Nova Consulta Rebuda</Heading>

					<Section style={section}>
						<Text style={sectionTitle}>Informació del Client:</Text>
						<div style={infoContainer}>
							<Text style={label}>Nom complet:</Text>
							<Text style={text}>
								{firstName} {lastName}
							</Text>

							<Text style={label}>Email:</Text>
							<Text style={text}>{email}</Text>

							<Text style={label}>Telèfon:</Text>
							<Text style={text}>{phone}</Text>
						</div>
					</Section>

					<Section style={messageSection}>
						<Text style={sectionTitle}>Missatge:</Text>
						<Text style={messageText}>{message}</Text>
					</Section>

					<Section style={footer}>
						<Text style={footerText}>
							Aquest missatge ha estat enviat des del formulari de contacte de
							interfustaandorra.com
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

const main = {
	backgroundColor: "#fff7ed", // amber-50
	fontFamily:
		"-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
};

const container = {
	margin: "0 auto",
	padding: "40px 20px",
	borderRadius: "8px",
};

const h1 = {
	color: "#92400e", // amber-800
	fontSize: "24px",
	fontWeight: "600",
	lineHeight: "1.4",
	margin: "16px 0",
	textAlign: "center" as const,
};

const section = {
	backgroundColor: "#ffffff",
	padding: "24px",
	borderRadius: "8px",
	marginBottom: "24px",
	border: "1px solid #fde68a", // amber-200
};

const messageSection = {
	...section,
	backgroundColor: "#fffbeb", // amber-50
};

const sectionTitle = {
	color: "#92400e", // amber-800
	fontSize: "16px",
	fontWeight: "600",
	marginBottom: "16px",
};

const infoContainer = {
	display: "grid",
	gridTemplateColumns: "100px 1fr",
	gap: "8px",
};

const label = {
	color: "#78350f", // amber-900
	fontSize: "14px",
	fontWeight: "500",
};

const text = {
	color: "#333",
	fontSize: "14px",
	margin: "0",
};

const messageText = {
	color: "#333",
	fontSize: "14px",
	lineHeight: "1.6",
	whiteSpace: "pre-wrap",
};

const footer = {
	textAlign: "center" as const,
	marginTop: "32px",
};

const footerText = {
	color: "#78350f", // amber-900
	fontSize: "12px",
};

export default ContactNotification;
