export class ValidateEmailDto {
  constructor(public readonly token: string) {}
  static validateEmail(token: string): [string?, ValidateEmailDto?] {
    if (!token) return ["Missing token"];
    return [undefined, new ValidateEmailDto(token)];
  }
}
