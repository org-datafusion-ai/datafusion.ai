import { Controller, Req, Res, All } from '@nestjs/common';
import { join, resolve } from 'path';
import { Request, Response } from 'express';
import * as fs from 'fs';


@Controller({ path: '*'})
export class FrontendController {
  @All()
  handleAll(@Req() req: Request, @Res() res: Response) {
    const publicPath = join(__dirname, '..', '..', 'public');

    if (req.path.startsWith('/api')) {
      return res.status(404).send('Not Found');
    }

    const requestedPath = resolve(publicPath, `.${req.path}`);
    if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
      return res.sendFile(requestedPath);
    }

    const indexPath = join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }

    return res.status(404).send();
  }
}
