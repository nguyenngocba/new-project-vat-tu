import { Supplier } from '@/types/supplier.types';
import { Building2, Phone, Mail, MapPin, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/cn';

interface SupplierCardProps {
  supplier: Supplier;
  onClick: () => void;
}

export function SupplierCard({ supplier, onClick }: SupplierCardProps) {
  const rating = supplier.rating || 0;
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));

  return (
    <div
      onClick={onClick}
      className="bg-bg-secondary border border-border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all hover:border-accent/30"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-accent" />
          <div>
            <h3 className="font-semibold text-text-primary">{supplier.name}</h3>
            <p className="text-xs text-text-muted">{supplier.code}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {stars.map((filled, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${filled ? 'fill-warning text-warning' : 'text-text-muted'}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {supplier.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-text-muted" />
            <span className="text-text-primary">{supplier.phone}</span>
          </div>
        )}
        {supplier.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-text-muted" />
            <span className="text-text-primary truncate">{supplier.email}</span>
          </div>
        )}
        {supplier.address && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-text-muted" />
            <span className="text-text-primary truncate">{supplier.address}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
        <span className="text-text-muted">Tổng chi:</span>
        <span className="font-medium text-accent">
          {formatCurrency(supplier.totalPurchases || 0)}
        </span>
      </div>
    </div>
  );
}
