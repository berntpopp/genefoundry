<script setup lang="ts">
// Legal wording copied verbatim from the original ImprintModal; layout only changed.
const content = {
  en: {
    title: 'Imprint',
    projectName: 'GeneFoundry',
    responsiblePerson: 'Responsible Person',
    contact: 'Contact',
    phone: 'Phone',
    email: 'Email',
    scope: 'Scope of Responsibility',
    scopeText: 'This imprint applies only to the online presence under the address:',
    limitation: 'Limitation',
    limitationText:
      'This web presence is part of the WWW and is therefore linked to external websites that can change at any time, which are consequently not subject to this scope of responsibility. Links have been checked once before inclusion to ensure they do not violate morals or laws.',
    serviceProvider: 'Service Provider',
    copyright: 'Copyright and Usage',
    copyrightText:
      'The author grants you the specific right to make a private copy for personal use. You are not authorized to alter, distribute, or publish the materials themselves. Unless explicitly stated otherwise, all copyrights remain with the responsible person.',
    dataProtection: 'Data Protection',
    dataProtectionText:
      'Personal data is only collected with your knowledge and consent. Upon request, you can obtain free information about the personal data stored about you. Please contact the administrator for this purpose.',
    bdsgNotice: 'According to § 28 BDSG, we object to any commercial use and distribution of data.',
    disclaimer: 'Disclaimer',
    disclaimerText:
      'The content of this web project has been carefully examined and created to the best of our knowledge. However, no claim is made for the completeness, timeliness, quality, and accuracy of the information provided. No responsibility can be assumed for damages resulting from trusting the contents of this website or their use.',
    ipViolation: 'Intellectual Property',
    ipViolationText:
      'If you suspect that one of your intellectual property rights is being violated from this website, please immediately inform us by email so that prompt remedial action can be taken.',
    linkDisclaimer: 'Link Disclaimer',
    linkDisclaimerText:
      'According to the judgment of May 12, 1998 - 312 O 85/98 - "Liability for Links," the Hamburg Regional Court decided that by placing a link, you might be partly responsible for the content of the linked site. We hereby expressly distance ourselves from all contents of all linked sites on our website and do not adopt these contents as our own.'
  },
  de: {
    title: 'Impressum',
    projectName: 'GeneFoundry',
    responsiblePerson: 'Verantwortlicher',
    contact: 'Kontakt',
    phone: 'Telefon',
    email: 'E-Mail',
    scope: 'Verantwortungsbereich',
    scopeText: 'Das Impressum gilt nur für die Internetpräsenz unter der Adresse:',
    limitation: 'Abgrenzung',
    limitationText:
      'Die Web-Präsenz ist Teil des WWW und dementsprechend mit fremden, sich jederzeit wandelnden Web-Sites verknüpft, die folglich auch nicht diesem Verantwortungsbereich unterliegen. Dass die Links weder gegen Sitten noch Gesetze verstoßen, wurde genau ein Mal geprüft (bevor sie hier aufgenommen wurden).',
    serviceProvider: 'Diensteanbieter',
    copyright: 'Urheberschutz und Nutzung',
    copyrightText:
      'Der Urheber räumt Ihnen ganz konkret das Nutzungsrecht ein, sich eine private Kopie für persönliche Zwecke anzufertigen. Nicht berechtigt sind Sie dagegen, die Materialien zu verändern und/oder weiter zu geben oder gar selbst zu veröffentlichen. Wenn nicht ausdrücklich anders vermerkt, liegen die Urheberrechte beim Verantwortlichen.',
    dataProtection: 'Datenschutz',
    dataProtectionText:
      'Personenbezogene Daten werden nur mit Ihrem Wissen und Ihrer Einwilligung erhoben. Auf Antrag erhalten Sie unentgeltlich Auskunft zu den über Sie gespeicherten personenbezogenen Daten. Wenden Sie sich dazu bitte an den Administrator.',
    bdsgNotice:
      'Gemäß § 28 BDSG widersprechen wir jeder kommerziellen Verwendung und Weitergabe der Daten.',
    disclaimer: 'Keine Haftung',
    disclaimerText:
      'Die Inhalte dieses Webprojektes wurden sorgfältig geprüft und nach bestem Wissen erstellt. Aber für die hier dargebotenen Informationen wird kein Anspruch auf Vollständigkeit, Aktualität, Qualität und Richtigkeit erhoben. Es kann keine Verantwortung für Schäden übernommen werden, die durch das Vertrauen auf die Inhalte dieser Website oder deren Gebrauch entstehen.',
    ipViolation: 'Schutzrechtsverletzung',
    ipViolationText:
      'Falls Sie vermuten, dass von dieser Website aus eines Ihrer Schutzrechte verletzt wird, teilen Sie das bitte umgehend per elektronischer Post mit, damit zügig Abhilfe geschaffen werden kann.',
    linkDisclaimer: 'Haftung für Links',
    linkDisclaimerText:
      'Lt. Urteil vom 12. Mai 1998 - 312 O 85/98 - "Haftung für Links" hat das Landgericht Hamburg entschieden, dass man durch die Anbringung eines Links, die Inhalte der gelinkten Seite ggf. mit zu verantworten hat. Hiermit distanzieren wir uns ausdrücklich von allen Inhalten aller gelinkten Seiten auf unserer Website und machen uns diese Inhalte nicht zu eigen.'
  }
}

// Original published contact details, preserved during migration.
const contactInfo = {
  name: 'Bernt Popp',
  address: 'Chaussestr. 58D',
  city: '10115 Berlin',
  phone: '0162 - 1086590',
  email: 'support@genefoundry.org',
  website: 'https://genefoundry.org/'
}

const paragraphs = [
  'limitation',
  'copyright',
  'dataProtection',
  'disclaimer',
  'ipViolation',
  'linkDisclaimer'
] as const
</script>
<template>
  <article class="reading-page prose imprint-page">
    <header class="page-header">
      <p class="eyebrow">Legal information</p>
      <h1>Imprint</h1>
      <nav aria-label="Imprint languages" class="inline-links">
        <a href="#imprint-en" lang="en">English</a><a href="#imprint-de" lang="de">Deutsch</a>
      </nav>
    </header>
    <div class="imprint-languages">
      <section v-for="(text, lang) in content" :key="lang" :id="`imprint-${lang}`" :lang="lang">
        <h2>{{ text.title }}</h2>
        <h3>{{ text.projectName }}</h3>
        <address>
          {{ contactInfo.name }}<br />{{ contactInfo.address }}<br />{{ contactInfo.city }}
        </address>
        <h3>{{ text.contact }}</h3>
        <p>{{ text.phone }}: {{ contactInfo.phone }}</p>
        <p>
          {{ text.email }}: <a :href="`mailto:${contactInfo.email}`">{{ contactInfo.email }}</a>
        </p>
        <h3>{{ text.responsiblePerson }}</h3>
        <p>{{ contactInfo.name }}</p>
        <p>{{ text.bdsgNotice }}</p>
        <h3>{{ text.scope }}</h3>
        <p>
          {{ text.scopeText }} <a :href="contactInfo.website">{{ contactInfo.website }}</a>
        </p>
        <h3>{{ text.limitation }}</h3>
        <p>{{ text.limitationText }}</p>
        <h3>{{ text.serviceProvider }}</h3>
        <p>{{ contactInfo.name }}</p>
        <template v-for="key in paragraphs.filter((key) => key !== 'limitation')" :key="key"
          ><h3>{{ text[key] }}</h3>
          <p>{{ text[`${key}Text`] }}</p></template
        >
      </section>
    </div>
  </article>
</template>
<style scoped>
.imprint-languages {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4rem;
}
.imprint-languages > section {
  min-width: 0;
  margin-top: 0;
}
@media (max-width: 760px) {
  .imprint-languages {
    grid-template-columns: minmax(0, 1fr);
  }
}
.imprint-page a {
  text-decoration: underline;
  overflow-wrap: anywhere;
}
.imprint-page address {
  font-style: normal;
}

.imprint-page h3 {
  margin-top: 2rem;
}
</style>
