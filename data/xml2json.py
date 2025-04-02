import xml.etree.ElementTree as ET
import json

def xml_to_json(xml_string):
    """
    Convert XML string to JSON
    
    Args:
        xml_string: String containing XML data
        
    Returns:
        JSON string representing the XML data
    """
    # Parse XML
    root = ET.fromstring(xml_string)
    
    # Convert XML to dictionary
    def element_to_dict(element):
        result = {}
        
        # Add attributes
        if element.attrib:
            result["@attributes"] = element.attrib
            
        # Add children
        children = list(element)
        if children:
            child_dict = {}
            for child in children:
                child_name = child.tag
                child_data = element_to_dict(child)
                
                # Handle multiple children with same tag
                if child_name in child_dict:
                    # If this tag already exists, convert to list if not already
                    if not isinstance(child_dict[child_name], list):
                        child_dict[child_name] = [child_dict[child_name]]
                    child_dict[child_name].append(child_data)
                else:
                    child_dict[child_name] = child_data
                    
            result.update(child_dict)
        
        # Add text content if any (and no children)
        text = element.text
        if text:
            text = text.strip()
            if text and not children:
                if not result:
                    result = text
                else:
                    result["#text"] = text
                    
        return result
    
    # Convert to dictionary and then to JSON
    result_dict = {root.tag: element_to_dict(root)}
    return json.dumps(result_dict, ensure_ascii=False, indent=2)

def convert_xml_file_to_json(xml_file_path, json_file_path=None):
    """
    Convert XML file to JSON file
    
    Args:
        xml_file_path: Path to XML file
        json_file_path: Path to output JSON file (optional)
                        If not provided, will use the same name as XML file with .json extension
    """
    if not json_file_path:
        json_file_path = xml_file_path.rsplit(".", 1)[0] + ".json"
        
    # Read XML file
    with open(xml_file_path, 'r', encoding='utf-8') as file:
        xml_content = file.read()
    
    # Convert to JSON
    json_content = xml_to_json(xml_content)
    
    # Write JSON file
    with open(json_file_path, 'w', encoding='utf-8') as file:
        file.write(json_content)
    
    return json_file_path

# Example usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        result_file = convert_xml_file_to_json(input_file, output_file)
        print(f"Converted XML to JSON. Output saved to {result_file}")
    else:
        print("Usage: python xml_to_json.py input.xml [output.json]")
