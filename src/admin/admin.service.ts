import { Injectable } from '@nestjs/common';

export interface Admin {
  id: number;
  name: string;
}

@Injectable()
export class AdminService {
  private admins: Admin[] = [];
  private idCounter = 1;

  create(admin: Omit<Admin, 'id'>): Admin {
    const newAdmin = { id: this.idCounter++, ...admin };
    this.admins.push(newAdmin);
    return newAdmin;
  }

  findAll(): Admin[] {
    return this.admins;
  }

  findOne(id: number): Admin | undefined {
    return this.admins.find(a => a.id === id);
  }

  update(id: number, updateData: Partial<Omit<Admin, 'id'>>): Admin | undefined {
    const admin = this.findOne(id);
    if (admin) {
      Object.assign(admin, updateData);
    }
    return admin;
  }

  remove(id: number): boolean {
    const index = this.admins.findIndex(a => a.id === id);
    if (index !== -1) {
      this.admins.splice(index, 1);
      return true;
    }
    return false;
  }
}
