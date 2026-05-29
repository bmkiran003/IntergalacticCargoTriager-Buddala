import json
import math

def is_prime(n):
    """Helper function to check if a number is prime."""
    if n <= 1:
        return False
    
    if n == 2:
        return True
    
    if n % 2 == 0:
        return False
    
    for i in range(3, int(math.sqrt(n)) + 1, 2):
        if n % i == 0:
            return False
            
    return True

def process_manifest(input_file, output_file):
    valid_records = []

    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()

            if not line:
                continue

            try:
                # Split date and remaining data
                parts = line.split("||")
                date = parts[0].strip()[1:-1]

                # Split cargo and remaining data
                cargo_part = parts[1].split("::")
                cargo_id = cargo_part[0].strip()

                # Split weight and destination
                weight_dest = cargo_part[1].split(">>")
                weight = float(weight_dest[0].strip())
                destination = weight_dest[1].strip()

                # Business Rule 1: Sector-7 Multiplier
                if "Sector-7" in destination:
                    weight *= 1.45

                rounded_weight = round(weight)

                # Business Rule 2: Prime Number Check
                if is_prime(rounded_weight):
                    continue

                record = {
                    "DATE": date,
                    "CARGO_ID": cargo_id,
                    "WEIGHT_IN_KG": rounded_weight,
                    "DESTINATION": destination
                }

                valid_records.append(record)
                
            except (IndexError, ValueError):
                # Silently skip any malformed lines that don't match the strict format
                continue

    # Generate the JSON output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(valid_records, f, indent=4)

    print(f"Success: {len(valid_records)} valid records written to {output_file}")


if __name__ == "__main__":
    process_manifest(
        "manifest.txt",
        "Task 1 - Buddala - Parser.json"
    )