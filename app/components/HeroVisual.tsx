import { CreditCard, Lock, Zap, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import heroImage from './Payment Image.png';

export function HeroVisual() {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12">
      {/* Background grid pattern */}
      <Image 
        src={heroImage} 
        alt="Hero Image" 
        fill 
        className="object-cover"
      />
    </div>
  );
}
