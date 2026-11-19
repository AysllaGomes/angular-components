import { FormControl } from '@angular/forms';

import { AppValidators, isValidCnpj, isValidCpf } from './validators';
import { applyMask, caretAfter, isNumericPattern, resolvePattern } from './mask';

describe('AppValidators', () => {
  it('CPF: check digits, with or without mask; repeated digits are invalid', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('52998224725')).toBe(true);
    expect(isValidCpf('529.982.247-24')).toBe(false);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('123')).toBe(false);
  });

  it('CNPJ: numeric and alphanumeric (IN RFB 2.229/2024), with or without mask', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpj('11.222.333/0001-82')).toBe(false);
    // exemplo oficial do CNPJ alfanumérico
    expect(isValidCnpj('12.ABC.345/01DE-35')).toBe(true);
    expect(isValidCnpj('12abc34501de35')).toBe(true);
    expect(isValidCnpj('12.ABC.345/01DE-36')).toBe(false);
    // verificadores são sempre dígitos
    expect(isValidCnpj('12.ABC.345/01DE-3A')).toBe(false);
    expect(isValidCnpj('00.000.000/0000-00')).toBe(false);
  });

  it('validators ignore empty values (required handles those) and return typed errors', () => {
    const ctrl = (v: string, fn = AppValidators.cpf()) => fn(new FormControl(v));
    expect(ctrl('')).toBeNull();
    expect(ctrl('529.982.247-25')).toBeNull();
    expect(ctrl('529.982.247-24')).toEqual({ cpf: true });
    expect(ctrl('11.222.333/0001-82', AppValidators.cnpj())).toEqual({ cnpj: true });
  });

  it('cpfOrCnpj decides by length (11 → CPF, 14 → CNPJ)', () => {
    const v = (s: string) => AppValidators.cpfOrCnpj()(new FormControl(s));
    expect(v('52998224725')).toBeNull();
    expect(v('12.ABC.345/01DE-35')).toBeNull();
    expect(v('11.222.333/0001-81')).toBeNull();
    expect(v('5299822472')).toEqual({ cpfCnpj: true });
    expect(v('52998224724')).toEqual({ cpfCnpj: true });
  });
});

describe('mask engine', () => {
  it('formats while typing and drops what does not fit', () => {
    expect(applyMask('52998224725', '000.000.000-00')).toEqual({ masked: '529.982.247-25', raw: '52998224725' });
    expect(applyMask('5299', '000.000.000-00').masked).toBe('529.9');
    expect(applyMask('529a', '000.000.000-00').masked).toBe('529'); // sem "." solto
    expect(applyMask('5299822472599', '000.000.000-00').raw).toBe('52998224725'); // corta o excesso
  });

  it('cpfCnpj switches to CNPJ after 11 characters or when a letter is typed (uppercased)', () => {
    expect(resolvePattern('cpfCnpj', '52998224725')).toBe('000.000.000-00');
    expect(resolvePattern('cpfCnpj', '112223330001')).toBe('**.***.***/****-00');
    const alnum = applyMask('12abc34501de35', resolvePattern('cpfCnpj', '12abc'));
    expect(alnum).toEqual({ masked: '12.ABC.345/01DE-35', raw: '12ABC34501DE35' });
  });

  it('phone switches between landline and mobile; custom patterns work', () => {
    expect(applyMask('1133334444', resolvePattern('phone', '1133334444')).masked).toBe('(11) 3333-4444');
    expect(applyMask('11933334444', resolvePattern('phone', '11933334444')).masked).toBe('(11) 93333-4444');
    expect(applyMask('123abc', '000-AAA').masked).toBe('123-abc');
  });

  it('numeric patterns ask for the numeric keyboard; caret goes after the same content', () => {
    expect(isNumericPattern('000.000.000-00')).toBe(true);
    expect(isNumericPattern('**.***.***/****-00')).toBe(false);
    expect(caretAfter('529.982.247-25', 4)).toBe(5); // depois do "9" de "529.9"
  });
});
