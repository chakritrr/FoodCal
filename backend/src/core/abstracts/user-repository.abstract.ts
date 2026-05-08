import { UserEntity } from '../entities';

export abstract class IUserRepository {
  abstract findAll(): Promise<UserEntity[]>;
  abstract findOneById(id: string): Promise<UserEntity>;
  abstract findOneByUsername(username: string): Promise<UserEntity>;
  abstract findOneByEmail(email: string): Promise<UserEntity>;
}
