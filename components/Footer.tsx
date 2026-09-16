type NavigationItem = { href: string; label: string };
type ContactDetails = { phone: string; email: string };
type FooterUi = { brand: string; subtitle: string; copy: string; copyright: string };

type Props = {
  navigation: NavigationItem[];
  contactDetails: ContactDetails;
  ui: FooterUi;
};

export function Footer({ navigation, contactDetails, ui }: Props) {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-shell">
          <div>
            <div className="footer-brand">{ui.brand}</div>
            <div className="footer-subtitle">{ui.subtitle}</div>
            <p className="footer-copy">
              {ui.copy}
            </p>
          </div>
          <div className="footer-nav">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="footer-copy">
            <div>{contactDetails.phone}</div>
            <div>{contactDetails.email}</div>
            <div>{ui.copyright}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
