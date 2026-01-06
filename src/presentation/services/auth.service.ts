import { bcryptAdapter, envs, jwtAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
  //DI
  constructor(
    // DI - Email service
    private readonly emailService: EmailService
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(registerUserDto);
      // Encriptar contraseña
      user.password = bcryptAdapter.hash(user.password);

      await user.save();

      // Email ce confirmacion
      await this.sendEmailValidationLink(user.email);

      // JWT <------ para mantener la autenticación del usuario
      const token = await jwtAdapter.generateToken({
        email: user.email,
      });

      if (!token) throw CustomError.internalServer("Error while creating JWT");

      // Email de confirmación
      const { password, ...rest } = UserEntity.fromObject(user);

      return {
        ...rest,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });

    if (!user) throw CustomError.badRequest("Email not exist");

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );

    if (!isMatching) throw CustomError.badRequest("Password is no valid");

    const { password, ...rest } = UserEntity.fromObject(user);

    try {
      const token = await jwtAdapter.generateToken({
        id: user.id,
      });

      if (!token) throw CustomError.internalServer("Error while creating JWT");

      return {
        user: rest,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await jwtAdapter.generateToken({ email }, "15m");
    if (!token) throw CustomError.internalServer("Error while creating JWT");
    const validateUrl = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const htmlBody = `<h1>Welcome to User Store</h1>
    <p>Click the link below to validate your email</p>
    <a href="${validateUrl}">Validate your email: ${email}</a>
    <p>The link will expire in 15 minutes</p>
    `;

    const isSent = await this.emailService.sendEmail({
      to: email,
      subject: "Email validation",
      htmlBody,
    });
    if (!isSent) throw CustomError.internalServer("Error sending email");
    return true;
  };

  public validateEmail = async (token: string) => {
    console.log("❤️❤️❤️❤️");
    const payload = await jwtAdapter.verifyToken(token);

    if (!payload) throw CustomError.badRequest("Token not valid");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Token payload not valid");

    const user = await UserModel.findOne({ email });

    if (!user) throw CustomError.internalServer("Email not exist");

    user.emailValidated = true;

    await user.save();

    return true;
  };
}
