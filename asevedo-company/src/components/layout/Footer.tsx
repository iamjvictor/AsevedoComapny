/**
 * Footer Component
 * Site footer with logo, CNPJ, contact info and partner link
 */

import { Container } from '@/components/ui/Container';
import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/30 border-t border-card-border/30 backdrop-blur-sm">
      <Container>
        {/* Main Footer Content */}
        <div className="py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Logo - Esquerda */}
          <Link href="/" className="shrink-0">
            <Image
              src="/LogoBranca.png"
              alt="Asevedo Company"
              width={600}
              height={170}
              className="h-40 md:h-48 w-auto"
            />
          </Link>

          {/* Contatos e Parceiro - Direita */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4">
            {/* Torne-se Parceiro - No topo */}
            <Link
              href="/parceiro"
              className="text-primary hover:text-primary/80 font-medium transition-colors text-base"
            >
              Torne-se um Parceiro →
            </Link>

            {/* CNPJ */}
            <p className="text-foreground-muted text-sm">
              CNPJ: 63.643.834/0001-35
            </p>

            {/* Contatos em lista vertical */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <a
                href="mailto:jvictor.asevedo@gmail.com"
                className="flex items-center gap-2 text-foreground-secondary hover:text-primary transition-colors text-sm"
              >
                <Mail size={16} />
                <span>jvictor.asevedo@gmail.com</span>
              </a>
              <a
                href="tel:+5522997892095"
                className="flex items-center gap-2 text-foreground-secondary hover:text-primary transition-colors text-sm"
              >
                <Phone size={16} />
                <span>+55 (22) 99789-2095</span>
              </a>
              {/* Redes Sociais */}
              <div className="flex items-center gap-4 mt-2">
                <a
                  href="https://www.linkedin.com/in/joaov-10/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-secondary hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://www.instagram.com/victor.svd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-secondary hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-card-border/30 text-center">
          <p className="text-foreground-muted text-xs">
            © {currentYear} Asevedo Company. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}

