// /qa 2026-10-12: currency input silently discarded the fractional amount.
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Input } from './Input';

it('preserves fractional amounts through change and blur', () => {
  const change=vi.fn();
  render(<Input label="Expense" type="number" step="0.01" min="0" onChange={e=>change(e.target.value)} />);
  const input=screen.getByRole('spinbutton',{name:'Expense'}) as HTMLInputElement;
  fireEvent.change(input,{target:{value:'100.10'}}); fireEvent.blur(input);
  expect(input.value).toBe('100.10'); expect(change).toHaveBeenLastCalledWith('100.10');
});
