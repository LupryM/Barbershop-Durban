import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';

interface RescheduleEmailProps {
  newDate: string;
  newTime: string;
  services: string;
  barberName: string;
}

export function RescheduleEmail({ newDate, newTime, services, barberName }: RescheduleEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your appointment has been rescheduled to {newDate} at {newTime}.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Xclusive Barber</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={heading}>
              Appointment Rescheduled
            </Heading>
            <Text style={paragraph}>Your appointment has been moved to a new time. Here are your updated details:</Text>

            <Section style={detailsBox}>
              <Row style={detailRow}>
                <Column style={detailLabel}>New Date</Column>
                <Column style={detailValue}>{newDate}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>New Time</Column>
                <Column style={detailValue}>{newTime}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Services</Column>
                <Column style={detailValue}>{services}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Barber</Column>
                <Column style={detailValue}>{barberName}</Column>
              </Row>
            </Section>

            <Text style={paragraph}>
              Please note: this was your <strong>one permitted reschedule</strong>. Any further changes will require a new booking.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              <strong>The Xclusive Barber Team</strong>
            </Text>
            <Text style={footerMuted}>xclusivebarber.co.za</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f6f6', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '20px 0', maxWidth: '600px' };
const header = { backgroundColor: '#1a1a1a', borderRadius: '8px 8px 0 0', padding: '24px', textAlign: 'center' as const };
const logo = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold', margin: '0' };
const content = { backgroundColor: '#ffffff', padding: '32px' };
const heading = { color: '#1a1a1a', fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' };
const paragraph = { color: '#444444', fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px' };
const detailsBox = { backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '16px 20px', margin: '20px 0' };
const detailRow = { marginBottom: '8px' };
const detailLabel = { color: '#888888', fontSize: '13px', fontWeight: 'bold' as const, textTransform: 'uppercase' as const, width: '40%' };
const detailValue = { color: '#1a1a1a', fontSize: '14px' };
const divider = { borderColor: '#e6e6e6', margin: '0' };
const footer = { backgroundColor: '#ffffff', borderRadius: '0 0 8px 8px', padding: '24px 32px' };
const footerText = { color: '#444444', fontSize: '14px', margin: '0 0 4px' };
const footerMuted = { color: '#999999', fontSize: '13px', margin: '4px 0 0' };
