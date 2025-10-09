`npx prisma format`
If any change's made in schems.prisma -> `npx prisma generate`
migrate cmd : `npx prisma migrate dev --name <migration_name>`
seed cmd : `npx prisma db seed`

=> Use @unique Constraints for master table's name -> Instead Of using the HardCoding UUID directly into Our Code


Error: EPERM: operation not permitted (query_engine-windows.dll.node)
 => Delete node_modules, pakage_lock-json
 => npm i